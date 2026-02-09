const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Plan / Product info snapshot
        plan: {
            planId: {
                type: String, // Changed from ObjectId to String to support hardcoded frontend IDs
                // ref: 'Product', 
            },
            name: String,
            pricePerMonth: Number,
        },

        // Delivery configuration
        frequency: {
            type: String,
            enum: ['DAILY', 'ALTERNATE', 'WEEKLY'],
            required: true,
        },

        quantityPerDelivery: {
            type: Number,
            required: true,
            min: 1,
        },

        deliveriesPerMonth: {
            type: Number,
            required: true,
        },

        monthlyQuantity: {
            type: Number,
            required: true,
        },

        deliverySlot: {
            type: String,
            enum: ['MORNING', 'EVENING'],
            default: 'MORNING',
        },

        // Address snapshot
        deliveryAddress: {
            addressId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Address',
            },
            name: String,
            phone: String,
            line1: String,
            line2: String,
            city: String,
            state: String,
            pincode: String,
        },

        // Dates
        startDate: {
            type: Date,
            required: true,
        },

        nextDeliveryDate: {
            type: Date,
            required: true,
            index: true,
        },

        lastDeliveredAt: Date,

        // Payment
        paymentMethod: {
            type: String,
            enum: ['UPI', 'CARD'],
            required: true,
        },

        paymentToken: {
            type: String, // Razorpay / Stripe subscription or mandate token
            required: true,
        },

        // Lifecycle
        status: {
            type: String,
            enum: ['ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED'],
            default: 'ACTIVE',
            index: true,
        },

        pausedAt: Date,
        cancelledAt: Date,
        cancelReason: String,
    },
    { timestamps: true }
)

module.exports = mongoose.model('Subscription', subscriptionSchema)
