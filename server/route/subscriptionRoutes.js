const express = require('express')
const router = express.Router()
const { requireSignin } = require('../controller/usercontroller')
const {
    createSubscription,
    getSubscriptions,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
} = require('../controller/subscriptionController')

router.use(requireSignin)

router.post('/create', createSubscription)
router.get('/', getSubscriptions)
router.patch('/:id/pause', pauseSubscription)
router.patch('/:id/resume', resumeSubscription)
router.patch('/:id/cancel', cancelSubscription)

module.exports = router
