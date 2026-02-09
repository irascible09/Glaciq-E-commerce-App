const mongoose = require("mongoose");

const inventoryLogSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        action: {
            type: String,
            enum: ["ADD", "REDUCE", "ORDER_DELIVERED"],
            required: true,
        },

        changeInBottles: {
            type: Number,
            required: true, // +ve or -ve
        },

        before: {
            packQuantity: Number,
            looseQuantity: Number,
        },

        after: {
            packQuantity: Number,
            looseQuantity: Number,
        },

        performedBy: {
            type: String, // "ADMIN" or "SYSTEM"
            default: "ADMIN",
        },

        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },

        reason: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("InventoryLog", inventoryLogSchema);
