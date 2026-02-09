const express = require('express')
const crypto = require('crypto')
const razorpay = require('../config/razorpayconfig')
const Order = require('../model/orderModel')

const router = express.Router()

// CREATE RAZORPAY ORDER
router.post('/create-order', async (req, res) => {
    try {
        const { orderId } = req.body

        const order = await Order.findById(orderId)
        if (!order) return res.status(404).json({ message: 'Order not found' })

        const razorpayOrder = await razorpay.orders.create({
            amount: order.totalAmount * 100,
            currency: 'INR',
            receipt: `order_${order._id}`,
        })

        order.razorpayOrderId = razorpayOrder.id
        await order.save()

        res.json({ ...razorpayOrder, key: process.env.RAZORPAY_KEY_ID })
    } catch (e) {
        console.error("Payment Error:", e);
        res.status(500).json({ message: 'Failed to create payment order', error: e.message })
    }
})

// RETRY PAYMENT (create new razorpay order)
router.post('/retry', async (req, res) => {
    try {
        const { orderId } = req.body

        const order = await Order.findById(orderId)
        if (!order) return res.status(404).json({ message: 'Order not found' })

        if (order.paymentStatus === 'PAID') {
            return res.status(400).json({ message: 'Order already paid' })
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: order.totalAmount * 100,
            currency: 'INR',
            receipt: `retry_${order._id}_${Date.now()}`,
        })

        order.razorpayOrderId = razorpayOrder.id
        order.paymentStatus = 'PENDING'
        await order.save()

        res.json({ ...razorpayOrder, key: process.env.RAZORPAY_KEY_ID })
    } catch (e) {
        res.status(500).json({ message: 'Retry failed' })
    }
})

// VERIFY PAYMENT
router.post('/verify', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body

        const body = razorpay_order_id + '|' + razorpay_payment_id
        const expected = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex')

        if (expected !== razorpay_signature) {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'FAILED',
            })
            return res.status(400).json({ message: 'Invalid signature' })
        }

        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'PAID',
            razorpayPaymentId: razorpay_payment_id,
        })

        res.json({ success: true })
    } catch (e) {
        res.status(500).json({ message: 'Payment verification failed' })
    }
})

module.exports = router