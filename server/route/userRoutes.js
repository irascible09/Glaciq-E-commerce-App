const express = require('express');
const { registercontroller, logincontroller, updateUserController, requireSignin, googleLoginController, appleLoginController, refreshTokenController, logoutController } = require('../controller/usercontroller');

// router object
const router = express.Router();

// routes

//register
router.post('/register', registercontroller);

//login
router.post('/login', logincontroller)

//google login
router.post('/google-login', googleLoginController);

// refresh token
router.post('/refresh-token', refreshTokenController)


// apple login
router.post('/apple-login', appleLoginController);

// update user details
router.put('/update-user', requireSignin, updateUserController)

// logout
router.post('/logout', requireSignin, logoutController)

// public config
router.get('/config', require('../controller/usercontroller').getStoreConfig)

// public products
router.get('/products', require('../controller/usercontroller').getAllProducts)

// public best sellers
router.get('/products/best-sellers', require('../controller/usercontroller').getBestSellers)


// export
module.exports = router;
