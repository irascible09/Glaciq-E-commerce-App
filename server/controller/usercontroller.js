const JWT = require('jsonwebtoken');
const { hashpassword, comparepassword } = require('../helper/authHelper');
const { generateAccessToken, generateRefreshToken } = require('../helper/tokenHelper');
const usermodel = require('../model/usermodel');
const Address = require('../model/addressModel');
var { expressjwt: jwt } = require("express-jwt");
const Session = require('../model/sessionModel')
const { hashToken, compareToken } = require('../helper/authHelper')


//google id
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(

    process.env.GOOGLE_WEB_CLIENT_ID

);

// apple id
const appleSigninAuth = require('apple-signin-auth');


//middleware
// const requireSignin = jwt({
//     secret: process.env.JWT_SECRET,
//     algorithms: ["HS256"],
// });

const ONE_HOUR = 60 * 60 * 1000

const requireSignin = async (req, res, next) => {
    try {
        //  Get token 
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' })
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Token missing' })
        }

        //  Verify 
        const decoded = JWT.verify(token, process.env.JWT_SECRET)

        //  Find 
        const user = await usermodel.findById(decoded._id)
        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }


        req.user = user

        //  Update lastActiveAt 
        if (
            !user.lastActiveAt ||
            Date.now() - new Date(user.lastActiveAt).getTime() > ONE_HOUR
        ) {
            user.lastActiveAt = new Date()
            await user.save()
        }

        // 6️⃣ Continue
        next()
    } catch (error) {
        // Token expired / invalid
        return res.status(401).json({
            message: 'Unauthorized',
            error: error.message,
        })
    }
}

// admin middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' })
    }
    next()
}


//register controller
const registercontroller = async (req, res) => { // async used cuz server may need to wait for req from user or client

    try {

        // requesting/fetching data from user 
        const { name, phone, email, address, password, businessName } = req.body; // data will be fetched and stored in these variables

        // console.log("Extracted data:", { name, email, password });

        // validation 
        if (!name || !email || !phone || !password || !address) {

            console.log("Validation failed");

            return res.status(400).send({

                success: false,
                message: 'invalid data'
            })
        }

        // check for existing user
        const existinguser = await usermodel.findOne({ email: email });
        if (existinguser) {
            return res.status(200).send({
                success: false,
                message: 'user exists'
            })
        }


        // if new user and credentials vaild 

        // save user and encrypting password using hash function :
        const hashedpassword = await hashpassword(password);
        const newUser = await usermodel({ name, phone, email, address, password: hashedpassword, businessName }).save()

        // after user save
        await Address.create({
            user: newUser._id,
            name,
            phone,
            line1: address,
            isDefault: true,
        })

        return res.status(201).send({

            success: true,
            message: 'registeration successful'
        })




    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'error in register controller :',
            error,
        });

    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// login controller 
const logincontroller = async (req, res) => {

    try {

        // fetch data from user
        const { email, password } = req.body;

        //validate
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'enter valid email or password'
            })
        }

        // find user 
        const user = await usermodel.findOne({ email: email })
        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // if user found, match password - 
        const match = await comparepassword(password, user.password) // password - from user, user.password - password in database
        if (!match) {
            return res.status(401).send({

                success: false,
                message: 'Invalid email or password'
            })
        }

        // generate tokens
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        // save refresh token in DB
        // user.refreshToken = refreshToken
        // await user.save()

        const refreshTokenHash = await hashToken(refreshToken)

        await Session.create({
            user: user._id,
            refreshTokenHash,
            device: req.headers['user-agent'],
            ip: req.ip,
            expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
        })


        user.password = undefined

        return res.status(200).send({
            success: true,
            message: 'logged in',
            accessToken,
            refreshToken,
            user,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({

            success: false,
            message: 'error in login api',
            error
        })
    }
}

// google controller ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GOOGLE LOGIN CONTROLLER
const googleLoginController = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).send({
                success: false,
                message: 'ID token is required',
            });
        }

        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_WEB_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId, picture } = payload;

        // Check if user exists
        let user = await usermodel.findOne({ email });

        if (!user) {
            // Create new Google user
            user = await new usermodel({
                name,
                email,
                googleId,
                picture,
                authType: 'google',
            }).save();
        } else {
            // Update picture if it changed
            if (picture && user.picture !== picture) {
                user.picture = picture;
                await user.save();
            }
        }

        // Block password login for Google users
        if (user.authType === 'google' && !user.googleId) {
            return res.status(400).send({
                success: false,
                message: 'Please login using Google',
            });
        }

        // Generate JWT
        // const token = JWT.sign(
        //     { _id: user._id },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '7d' }
        // );

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        // user.refreshToken = refreshToken
        // await user.save()

        const refreshTokenHash = await hashToken(refreshToken)

        await Session.create({
            user: user._id,
            refreshTokenHash,
            device: req.headers['user-agent'],
            ip: req.ip,
            expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
        })

        user.password = undefined;

        return res.status(200).send({
            success: true,
            message: 'Google login successful',
            accessToken,
            refreshToken,
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Google login failed',
            error,
        });
    }
};

// apple id controller 
const appleLoginController = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).send({
                success: false,
                message: 'Apple ID token required',
            });
        }

        // Verify Apple token
        const appleData = await appleSigninAuth.verifyIdToken(idToken, {
            audience: process.env.APPLE_CLIENT_ID,
            ignoreExpiration: false,
        });

        const { email, sub: appleId } = appleData;

        let user = await usermodel.findOne({ email });

        if (!user) {
            user = await new usermodel({
                name: 'Apple User',
                email,
                appleId,
                authType: 'apple',
            }).save();
        }

        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        // user.refreshToken = refreshToken
        // await user.save()
        const refreshTokenHash = await hashToken(refreshToken)

        await Session.create({
            user: user._id,
            refreshTokenHash,
            device: req.headers['user-agent'],
            ip: req.ip,
            expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
        })

        user.password = undefined;

        return res.status(200).send({
            success: true,
            message: 'Apple login successful',
            accessToken,
            refreshToken,
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Apple login failed',
            error,
        });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////

const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return res.status(401).send({ message: 'Refresh token required' })
        }

        const decoded = JWT.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        )

        const session = await Session.findOne({ user: decoded._id })
        if (!session) {
            return res.status(403).send({ message: 'Session expired' })
        }

        const isValid = await compareToken(
            refreshToken,
            session.refreshTokenHash
        )

        if (!isValid) {
            return res.status(403).send({ message: 'Invalid refresh token' })
        }

        await Session.deleteOne({ _id: session._id })

        const newAccessToken = generateAccessToken(decoded._id)
        const newRefreshToken = generateRefreshToken(decoded._id)
        const newRefreshHash = await hashToken(newRefreshToken)

        await Session.create({
            user: decoded._id,
            refreshTokenHash: newRefreshHash,
            device: req.headers['user-agent'],
            ip: req.ip,
            expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
        })

        return res.send({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        })
    } catch (error) {
        return res.status(403).send({ message: 'Refresh failed' })
    }
}





// update user details ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Get store config (public)
const getStoreConfig = async (req, res) => {
    try {
        const Settings = require('../model/Settings');
        let settings = await Settings.findOne({ key: 'global_config' });
        if (!settings) settings = { deliveryCharge: 0, minFreeDeliveryAmount: 500, bulkDiscounts: [] };

        res.json({
            success: true,
            config: {
                deliveryCharge: settings.deliveryCharge,
                minFreeDeliveryAmount: settings.minFreeDeliveryAmount,
                bulkDiscounts: settings.bulkDiscounts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch config" });
    }
};

const updateUserController = async (req, res) => {

    try {

        const { name, password, email } = req.body

        //find user
        const user = await usermodel.findOne({ email: email })

        //validate password
        if (password && password.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'password required, please enter password'
            })
        }
        const hashedpassword = password ? await hashpassword(password) : undefined

        //updated user
        const updatedUser = await usermodel.findOneAndUpdate({ email }, {
            name: name || user.name,
            password: hashedpassword || user.password
        }, { new: true })

        // send res
        res.status(200).send({
            success: true,
            message: 'user updated successfully',
            updatedUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error while updating user details',
            error
        })
    }
}

const logoutController = async (req, res) => {
    await Session.deleteMany({ user: req.user._id })
    res.send({ success: true })
}



// Get all products (public)
const getAllProducts = async (req, res) => {
    try {
        const Product = require('../model/productmodel');
        // Fetch active products
        const products = await Product.find({ isActive: true });

        const response = products.map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.image,
            description: p.description,
            stock: p.stock,
            packSize: p.packSize,
            isSubscription: p.isSubscription // Assuming this field exists, if not it will be undefined which is fine
        }));

        res.json({ success: true, products: response });
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
};

// Get best sellers (public)
const getBestSellers = async (req, res) => {
    try {
        const Product = require('../model/productmodel');
        const products = await Product.find({ isActive: true, isBestSeller: true });

        const response = products.map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.image,
            // description: p.description, // Not strictly needed for home cards
            // stock: p.stock,
            packSize: p.packSize,
        }));

        res.json({ success: true, products: response });
    } catch (error) {
        console.error("Get best sellers error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch best sellers" });
    }
};

module.exports = { registercontroller, logincontroller, updateUserController, requireSignin, requireAdmin, googleLoginController, appleLoginController, refreshTokenController, logoutController, getStoreConfig, getAllProducts, getBestSellers };
