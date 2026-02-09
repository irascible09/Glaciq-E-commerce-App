const express = require('express');
const { registerBusinessStep1, registerBusinessStep2 } = require('../controller/businesscontroller.js');

// router object
const router = express.Router();

router.post('/register-step-1', registerBusinessStep1);
router.post('/register-step-2', registerBusinessStep2);




module.exports = router;