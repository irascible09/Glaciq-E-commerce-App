const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true, // e.g., 'global_config'
        default: 'global_config'
    },
    deliveryCharge: {
        type: Number,
        default: 0,
    },
    minFreeDeliveryAmount: {
        type: Number,
        default: 500,
    },
    bulkDiscounts: [{
        minOrderValue: { type: Number, required: true },
        discountPercentage: { type: Number, required: true }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
