const Order = require('../model/orderModel')
const Product = require('../model/productmodel')
const InventoryLog = require("../model/InventoryLog");


// Create a new order
const createOrder = async (req, res) => {
    try {
        const { items, address, paymentMethod, notes } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' })
        }

        // ✅ STOCK VALIDATION (NO DEDUCTION HERE)
        for (const item of items) {
            // only validate if product id exists
            if (!item.id || item.id.length !== 24) continue;

            const product = await Product.findById(item.id);

            if (!product || !product.isActive) {
                return res.status(400).json({
                    message: `${item.name} is not available`,
                });
            }

            const requiredBottles =
                item.quantity * product.packSize;

            const availableBottles =
                product.stock.looseQuantity +
                product.stock.packQuantity * product.packSize;

            if (requiredBottles > availableBottles) {
                return res.status(400).json({
                    message: `${product.name} is out of stock`,
                });
            }
        }


        if (!address) {
            return res.status(400).json({ message: 'Delivery address is required' })
        }

        // Process items with proper details
        const processedItems = items.map(item => {
            // Handle image - can be string URL or object with uri
            let imageUrl = null
            if (typeof item.image === 'string') {
                imageUrl = item.image
            } else if (item.image && item.image.uri) {
                imageUrl = item.image.uri
            }

            return {
                // Only set product if it's a valid ObjectId (24 char hex string)
                ...(item.id && item.id.length === 24 ? { product: item.id } : {}),
                name: item.name || item.title,
                price: item.price,
                quantity: item.quantity,
                image: imageUrl,
                subtotal: item.price * item.quantity,
            }
        })

        // Calculate totals
        const itemsTotal = processedItems.reduce(
            (sum, item) => sum + item.subtotal,
            0
        )

        // Fetch Global Settings
        const Settings = require('../model/Settings');
        let settings = await Settings.findOne({ key: 'global_config' });
        if (!settings) settings = { deliveryCharge: 0, minFreeDeliveryAmount: 500, bulkDiscounts: [] };

        // Calculate Discount
        let discount = 0;
        if (settings.bulkDiscounts && settings.bulkDiscounts.length > 0) {
            // Sort discounts by minOrderValue descending to find best match
            const sortedDiscounts = settings.bulkDiscounts.sort((a, b) => b.minOrderValue - a.minOrderValue);
            const applicableDiscount = sortedDiscounts.find(d => itemsTotal >= d.minOrderValue);

            if (applicableDiscount) {
                discount = Math.round(itemsTotal * (applicableDiscount.discountPercentage / 100));
            }
        }

        const amountAfterDiscount = itemsTotal - discount;

        // Calculate Delivery Fee
        const deliveryFee = amountAfterDiscount >= settings.minFreeDeliveryAmount
            ? 0
            : settings.deliveryCharge;

        const totalAmount = amountAfterDiscount + deliveryFee

        // Generate order number
        const date = new Date()
        const year = date.getFullYear().toString().slice(-2)
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        const orderNumber = `GQ${year}${month}${day}${random} `

        const order = await Order.create({
            user: req.user._id,
            orderNumber,
            userInfo: {
                userId: req.user._id.toString(),
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
            },
            items: processedItems,
            deliveryAddress: {
                name: address.name,
                phone: address.phone,
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
            },
            paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
            orderStatus: 'PLACED',
            orderStatus: 'PLACED',
            itemsTotal,
            deliveryFee,
            discount,
            totalAmount,
            notes,
        })



        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to create order', error })
    }
}

// Get all orders for a user
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to fetch orders', error })
    }
}

// Get single order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        })

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        res.status(200).json(order)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to fetch order', error })
    }
}

// Cancel an order
const cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body || {}
        const { id } = req.params

        // Validate ObjectId
        const mongoose = require('mongoose')
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid order ID' })
        }

        const order = await Order.findOne({
            _id: id,
            user: req.user._id
        })

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        // Only allow cancellation for PLACED or CONFIRMED orders
        if (!['PLACED', 'CONFIRMED'].includes(order.orderStatus)) {
            return res.status(400).json({
                message: 'Order cannot be cancelled at this stage'
            })
        }

        order.orderStatus = 'CANCELLED'
        order.cancelledAt = new Date()
        order.cancelReason = reason || 'Cancelled by user'
        await order.save()

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order,
        })
    } catch (error) {
        console.log('Cancel order error:', error)
        res.status(500).json({ message: 'Failed to cancel order', error: error.message })
    }
}



module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    cancelOrder,
}
