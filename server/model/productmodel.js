const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        sku: {
            type: String,
            unique: true,
            required: true,
        },

        category: {
            type: String,
            default: "BOTTLE",
        },

        size: {
            type: String,
            required: true,
            // future-proof, NOT enum-locked
            // examples: "250ML", "500ML", "1L", "2L", "5L"
        },

        packaging: {
            type: String,
            enum: ["LOOSE", "PACK"],
            required: true,
        },

        packSize: {
            type: Number,
            default: 1, // 1 for loose, 12/24/48 for packs
        },

        price: {
            type: Number,
            required: true,
        },

        discount: {
            type: Number,
            default: 0,
        },

        stock: {
            looseQuantity: {
                type: Number,
                default: 0,
            },
            packQuantity: {
                type: Number,
                default: 0,
            },
            lowStockThreshold: {
                type: Number,
                default: 20, // threshold in packs
            },
        },

        image: String,

        isActive: {
            type: Boolean,
            default: true,
        },

        isBestSeller: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

productSchema.pre("save", async function () {
    if (
        this.stock.packQuantity < 0 ||
        this.stock.looseQuantity < 0
    ) {
        throw new Error("Invalid inventory state");
    }
});


module.exports = mongoose.model("Product", productSchema);
