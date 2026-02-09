const Admin = require("../model/Admin");
const { hashpassword } = require('../helper/authHelper')
const Product = require("../model/productmodel");
const InventoryLog = require("../model/InventoryLog");

const createAdmin = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            })
        }

        const existing = await Admin.findOne({ email })
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Admin already exists',
            })
        }

        // We can keep using hashpassword from authHelper as it is just bcrypt
        // Assuming Admin model has pre-save hook for password hashing, 
        // BUT current Admin.js has pre-save hook.
        // Let's check if we should pass raw password or hashed.
        // Admin.js has: adminSchema.pre("save", ... this.password = await bcrypt.hash(this.password, 10))
        // So we should pass RAW password. 
        // However, the original code hashed it manually.
        // If I pass raw password, Admin.js will hash it.

        const admin = await Admin.create({
            name,
            email,
            password, // Raw password, let model handle hashing
        })

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
            },
        })
    } catch (error) {
        console.error('Create admin error:', error)
        res.status(500).json({
            success: false,
            message: 'Failed to create admin',
            error: error.message
        })
    }
}

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}).select('-password');
        res.json({ success: true, admins });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch admins" });
    }
};

// Delete admin
const deleteAdmin = async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments({});
        if (adminCount <= 1) {
            return res.status(400).json({ success: false, message: "Cannot delete the last admin" });
        }

        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

        res.json({ success: true, message: "Admin removed" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete admin" });
    }
};


//product controllers - 

// GET inventory
exports.getInventory = async (req, res) => {
    const products = await Product.find({}, {
        name: 1,
        size: 1,
        packaging: 1,
        packSize: 1,
        stock: 1,
        isActive: 1,
        isBestSeller: 1, // Added
        price: 1,
        discount: 1
    });

    const response = products.map(p => {
        let status = "OK";
        if (p.stock.packQuantity === 0) status = "OUT_OF_STOCK";
        else if (p.stock.packQuantity <= p.stock.lowStockThreshold)
            status = "LOW_STOCK";

        return {
            id: p._id,
            name: p.name,
            size: p.size,
            packSize: p.packSize,
            price: p.price,
            discount: p.discount,
            packs: p.stock.packQuantity,
            loose: p.stock.looseQuantity,
            status,
            isActive: p.isActive,
            isBestSeller: p.isBestSeller // Added
        };
    });

    res.json(response);
};


// ADD STOCK (bottles-based input)
// exports.addStock = async (req, res) => {
//     try {
//         const { addedBottles } = req.body;
//         const product = await Product.findById(req.params.id);

//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         let totalLoose =
//             product.stock.looseQuantity + addedBottles;

//         const newPacks = Math.floor(
//             totalLoose / product.packSize
//         );
//         const remainingLoose =
//             totalLoose % product.packSize;

//         product.stock.packQuantity += newPacks;
//         product.stock.looseQuantity = remainingLoose;

//         await product.save();

//         res.json({
//             message: "Stock added successfully",
//             stock: product.stock,
//         });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

exports.addStock = async (req, res) => {
    const { addedBottles } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product)
        return res.status(404).json({ message: "Product not found" });

    const beforeState = {
        packQuantity: product.stock.packQuantity,
        looseQuantity: product.stock.looseQuantity,
    };

    let totalLoose = product.stock.looseQuantity + addedBottles;
    const newPacks = Math.floor(totalLoose / product.packSize);
    const remainingLoose = totalLoose % product.packSize;

    product.stock.packQuantity += newPacks;
    product.stock.looseQuantity = remainingLoose;

    await product.save();

    await InventoryLog.create({
        product: product._id,
        action: "ADD",
        changeInBottles: addedBottles,
        before: beforeState,
        after: {
            packQuantity: product.stock.packQuantity,
            looseQuantity: product.stock.looseQuantity,
        },
        admin: req.admin._id,
        performedBy: "ADMIN",
        reason: "Manual stock addition",
    });

    res.json({ message: "Stock added successfully" });
};


// reduce stock
// exports.reduceStock = async (req, res) => {
//     const { reduceBottles } = req.body;
//     const product = await Product.findById(req.params.id);

//     if (!product) return res.status(404).json({ message: "Product not found" });

//     const totalAvailable =
//         product.stock.looseQuantity +
//         product.stock.packQuantity * product.packSize;

//     if (reduceBottles > totalAvailable) {
//         return res.status(400).json({ message: "Insufficient stock" });
//     }

//     let remaining = reduceBottles;

//     if (product.stock.looseQuantity >= remaining) {
//         product.stock.looseQuantity -= remaining;
//     } else {
//         remaining -= product.stock.looseQuantity;
//         product.stock.looseQuantity = 0;

//         const packsUsed = Math.ceil(remaining / product.packSize);
//         product.stock.packQuantity -= packsUsed;

//         const excess = packsUsed * product.packSize - remaining;
//         product.stock.looseQuantity += excess;
//     }

//     await product.save();
//     res.json({ message: "Stock reduced" });
// };

exports.reduceStock = async (req, res) => {
    const { reduceBottles } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product)
        return res.status(404).json({ message: "Product not found" });

    const totalAvailable =
        product.stock.looseQuantity +
        product.stock.packQuantity * product.packSize;

    if (reduceBottles > totalAvailable) {
        return res.status(400).json({ message: "Insufficient stock" });
    }

    const beforeState = {
        packQuantity: product.stock.packQuantity,
        looseQuantity: product.stock.looseQuantity,
    };

    let remaining = reduceBottles;

    if (product.stock.looseQuantity >= remaining) {
        product.stock.looseQuantity -= remaining;
    } else {
        remaining -= product.stock.looseQuantity;
        product.stock.looseQuantity = 0;

        const packsUsed = Math.ceil(remaining / product.packSize);
        product.stock.packQuantity -= packsUsed;

        const excess = packsUsed * product.packSize - remaining;
        product.stock.looseQuantity += excess;
    }

    await product.save();

    await InventoryLog.create({
        product: product._id,
        action: "REDUCE",
        changeInBottles: -reduceBottles,
        before: beforeState,
        after: {
            packQuantity: product.stock.packQuantity,
            looseQuantity: product.stock.looseQuantity,
        },
        admin: req.admin._id,
        performedBy: "ADMIN",
        reason: "Manual stock reduction",
    });

    res.json({ message: "Stock reduced successfully" });
};







// Update product discount
exports.updateProductDiscount = async (req, res) => {
    try {
        const { discount } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        product.discount = discount;
        await product.save();

        res.json({ message: "Discount updated", product });
    } catch (err) {
        res.status(500).json({ message: "Failed to update discount" });
    }
};

// Toggle product status (Active/Inactive)
exports.toggleProductStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.isActive = !product.isActive;
        await product.save();

        res.json({
            message: `Product is now ${product.isActive ? 'Active' : 'Inactive'}`,
            isActive: product.isActive
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update status" });
    }
};

// Update product price
exports.updateProductPrice = async (req, res) => {
    try {
        const { price } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.price = price;
        await product.save();

        res.json({ message: "Price updated", product });
    } catch (err) {
        res.status(500).json({ message: "Failed to update price" });
    }
};

// Create new product
exports.createProduct = async (req, res) => {
    try {
        const { name, size, packSize, price, packaging, sku } = req.body;

        if (!name || !size || !packSize || !price) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Normalize packaging to allowed enum values
        let validPackaging = packaging ? packaging.toUpperCase() : "PACK";
        if (!["LOOSE", "PACK"].includes(validPackaging)) {
            validPackaging = "PACK"; // Fallback to default
        }

        const newProduct = await Product.create({
            name,
            size,
            packSize: Number(packSize),
            price: Number(price),
            packaging: validPackaging,
            sku: sku || `SKU-${Date.now()}`,
            stock: {
                looseQuantity: 0,
                packQuantity: 0,
                lowStockThreshold: 10
            },
            isActive: true
        });

        res.status(201).json({ message: "Product created", product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create product" });
    }
};

// Toggle product best seller status
exports.toggleBestSeller = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.isBestSeller = !product.isBestSeller;
        await product.save();

        res.json({
            message: `Product is now ${product.isBestSeller ? 'in' : 'removed from'} Best Sellers`,
            isBestSeller: product.isBestSeller
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update best seller status" });
    }
};

module.exports = {
    createAdmin,
    getAllAdmins,
    deleteAdmin,
    getInventory: exports.getInventory,
    addStock: exports.addStock,
    reduceStock: exports.reduceStock,
    updateProductDiscount: exports.updateProductDiscount,
    toggleProductStatus: exports.toggleProductStatus,
    updateProductPrice: exports.updateProductPrice,
    createProduct: exports.createProduct,
    toggleBestSeller: exports.toggleBestSeller
}

