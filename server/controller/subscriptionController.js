const Subscription = require('../model/subscriptionModel')
const Order = require('../model/orderModel')
const Address = require('../model/addressModel')

// Helper: calculate next delivery date
const getNextDeliveryDate = (date, frequency) => {
    const next = new Date(date)

    if (frequency === 'DAILY') next.setDate(next.getDate() + 1)
    if (frequency === 'ALTERNATE') next.setDate(next.getDate() + 2)
    if (frequency === 'WEEKLY') next.setDate(next.getDate() + 7)

    return next
}

// CREATE SUBSCRIPTION
const createSubscription = async (req, res) => {
    try {
        const {
            plan,
            frequency,
            quantityPerDelivery,
            deliveriesPerMonth,
            monthlyQuantity,
            deliverySlot,
            startDate,
            addressId,
            paymentMethod,
            paymentToken,
        } = req.body

        if (!addressId || !paymentToken) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const address = await Address.findById(addressId)
        if (!address) {
            return res.status(404).json({ message: 'Address not found' })
        }

        const subscription = await Subscription.create({
            user: req.user._id,

            plan,

            frequency,
            quantityPerDelivery,
            deliveriesPerMonth,
            monthlyQuantity,
            deliverySlot,

            deliveryAddress: {
                addressId: address._id,
                name: address.name,
                phone: address.phone,
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
            },

            startDate,
            nextDeliveryDate: startDate,

            paymentMethod,
            paymentToken,
        })

        res.status(201).json({
            success: true,
            message: 'Subscription created',
            subscription,
        })
    } catch (error) {
        console.log('Create subscription error:', error)
        res.status(500).json({ message: 'Failed to create subscription' })
    }
}

// GET USER SUBSCRIPTIONS
const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({
            user: req.user._id,
        }).sort({ createdAt: -1 })

        res.json(subscriptions)
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscriptions' })
    }
}

// PAUSE SUBSCRIPTION
const pauseSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            _id: req.params.id,
            user: req.user._id,
        })

        if (!subscription || subscription.status !== 'ACTIVE') {
            return res.status(400).json({ message: 'Cannot pause subscription' })
        }

        subscription.status = 'PAUSED'
        subscription.pausedAt = new Date()
        await subscription.save()

        res.json({ success: true, message: 'Subscription paused' })
    } catch (error) {
        res.status(500).json({ message: 'Pause failed' })
    }
}

// RESUME SUBSCRIPTION
const resumeSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            _id: req.params.id,
            user: req.user._id,
        })

        if (!subscription || subscription.status !== 'PAUSED') {
            return res.status(400).json({ message: 'Cannot resume subscription' })
        }

        subscription.status = 'ACTIVE'
        subscription.nextDeliveryDate = new Date()
        await subscription.save()

        res.json({ success: true, message: 'Subscription resumed' })
    } catch (error) {
        res.status(500).json({ message: 'Resume failed' })
    }
}

// CANCEL SUBSCRIPTION
const cancelSubscription = async (req, res) => {
    try {
        const { reason } = req.body

        const subscription = await Subscription.findOne({
            _id: req.params.id,
            user: req.user._id,
        })

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' })
        }

        subscription.status = 'CANCELLED'
        subscription.cancelledAt = new Date()
        subscription.cancelReason = reason || 'Cancelled by user'
        await subscription.save()

        res.json({ success: true, message: 'Subscription cancelled' })
    } catch (error) {
        res.status(500).json({ message: 'Cancel failed' })
    }
}

module.exports = {
    createSubscription,
    getSubscriptions,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    getNextDeliveryDate,
}
