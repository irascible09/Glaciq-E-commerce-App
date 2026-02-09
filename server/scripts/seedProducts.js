const mongoose = require("mongoose");
const Product = require("../model/productmodel");
require('dotenv').config();

const products = [
    {
        name: "250ml Bottle Pack (48)",
        sku: "WTR-250-PACK",
        size: "250ML",
        packaging: "PACK",
        packSize: 48,
        price: 420,
        stock: {
            looseQuantity: 0,
            packQuantity: 40,
            lowStockThreshold: 10,
        },
    },
    {
        name: "500ml Bottle Pack (24)",
        sku: "WTR-500-PACK",
        size: "500ML",
        packaging: "PACK",
        packSize: 24,
        price: 330,
        stock: {
            looseQuantity: 0,
            packQuantity: 30,
            lowStockThreshold: 8,
        },
    },
    {
        name: "1L Bottle Pack (12)",
        sku: "WTR-1L-PACK",
        size: "1L",
        packaging: "PACK",
        packSize: 12,
        price: 280,
        stock: {
            looseQuantity: 0,
            packQuantity: 25,
            lowStockThreshold: 6,
        },
    },
];

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        await Product.deleteMany();
        await Product.insertMany(products);
        console.log("✅ Products seeded");
    } catch (error) {
        console.error("Error seeding products:", error);
    } finally {
        process.exit();
    }
})();
