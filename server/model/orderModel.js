const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: String,  // Store image URL for order history display
    subtotal: Number, // price * quantity
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    orderNumber: {
        type: String,
        unique: true,
    },

    // Store user info directly for easy access
    userInfo: {
        userId: String,
        name: String,
        email: String,
        phone: String,
    },

    items: [orderItemSchema],

    deliveryAddress: {
        name: String,
        phone: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: String,
    },

    paymentMethod: {
        type: String,
        enum: ['UPI', 'CARD', 'COD'],
        required: true,
    },

    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,

    orderStatus: {
        type: String,
        enum: ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
        default: 'PLACED',
    },

    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPartner',
        default: null,
    },

    itemsTotal: Number,      // Sum of all item subtotals
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: Number,     // Final amount after delivery and discount

    notes: String,           // Special instructions

    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,



}, { timestamps: true })

// Generate order number before saving
orderSchema.pre('save', async function () {
    if (!this.orderNumber) {
        const date = new Date()
        const year = date.getFullYear().toString().slice(-2)
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        this.orderNumber = `GQ${year}${month}${day}${random}`
    }
})

module.exports = mongoose.model('Order', orderSchema)
