const Subscription = require('../model/subscriptionModel')
const Order = require('../model/orderModel')
const { getNextDeliveryDate } = require('../controller/subscriptionController')

const runSubscriptionOrders = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const subscriptions = await Subscription.find({
        status: 'ACTIVE',
        nextDeliveryDate: { $lte: today },
    })

    for (const sub of subscriptions) {
        await Order.create({
            user: sub.user,
            items: [
                {
                    name: sub.plan.name,
                    price: 0,
                    quantity: sub.quantityPerDelivery,
                    subtotal: 0,
                },
            ],
            deliveryAddress: sub.deliveryAddress,
            paymentMethod: sub.paymentMethod,
            paymentStatus: 'PAID',
            orderStatus: 'PLACED',
            notes: 'Auto-generated from subscription',
        })

        sub.lastDeliveredAt = today
        sub.nextDeliveryDate = getNextDeliveryDate(today, sub.frequency)
        await sub.save()
    }

    console.log('Subscription orders processed')
}

module.exports = runSubscriptionOrders
