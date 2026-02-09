const express = require('express')
const router = express.Router()
const { requireSignin } = require('../controller/usercontroller')
const {
    createOrder,
    getOrders,
    getOrderById,
    cancelOrder,
} = require('../controller/ordercontroller')

// All routes require authentication
router.use(requireSignin)

// POST /api/v1/order/create - Create a new order
router.post('/create', createOrder)

// GET /api/v1/order - Get all orders for user
router.get('/', getOrders)

// GET /api/v1/order/:id - Get single order
router.get('/:id', getOrderById)

// PATCH /api/v1/order/:id/cancel - Cancel an order
router.patch('/:id/cancel', cancelOrder)

module.exports = router
