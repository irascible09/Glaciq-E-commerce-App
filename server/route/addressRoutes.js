const express = require('express')
const router = express.Router()
const { requireSignin } = require('../controller/usercontroller')
const {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} = require('../controller/addressController')

// All routes require authentication
router.use(requireSignin)

// GET /api/v1/address - Get all addresses for the user
router.get('/', getAddresses)

// POST /api/v1/address - Add a new address
router.post('/', addAddress)

// PUT /api/v1/address/:id - Update an address
router.put('/:id', updateAddress)

// DELETE /api/v1/address/:id - Delete an address
router.delete('/:id', deleteAddress)

// PATCH /api/v1/address/:id/default - Set an address as default
router.patch('/:id/default', setDefaultAddress)

module.exports = router
