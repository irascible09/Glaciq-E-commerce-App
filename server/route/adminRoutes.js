const express = require('express')
const router = express.Router()

const adminAuth = require('../middleware/adminAuth')
const { createAdmin, getAllAdmins, deleteAdmin } = require('../controller/adminController')

router.post('/create', adminAuth, createAdmin)
router.get('/', adminAuth, getAllAdmins)
router.delete('/:id', adminAuth, deleteAdmin)

module.exports = router
