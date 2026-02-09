const JWT = require('jsonwebtoken');
const { hashpassword, comparepassword } = require('../helper/authHelper');
const usermodel = require('../model/usermodel');
var { expressjwt: jwt } = require("express-jwt");

const BusinessProfile = require('../model/BusinessProfile.js');
const geocodeLocation = require('../helper/geocode.js')
const User = require('../model/usermodel');


const registerBusinessStep1 = async (req, res) => {
    try {
        const { name, phone, email, password, businessName } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password required',
            });
        }

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            const hashedPassword = await hashpassword(password);

            user = await User.create({
                name,
                phone,
                email,
                password: hashedPassword,
                role: 'business',
            });
        } else {
            // user exists then verify password
            const match = await comparepassword(password, user.password);
            if (!match) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }
        }

        // find or create DRAFT business for this user
        let business = await BusinessProfile.findOne({
            userId: user._id,
            verificationStatus: 'draft',
        });

        if (!business) {
            business = await BusinessProfile.create({
                userId: user._id,
                businessName,
                verificationStatus: 'draft',
            });
        }

        // generate token
        const token = JWT.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        user.password = undefined;

        
        res.status(200).json({
            success: true,
            message: 'Step 1 completed / resumed',
            token,
            user,
            businessId: business._id,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Step 1 failed',
        });
    }
};

const registerBusinessStep2 = async (req, res) => {
  try {
    const {
      businessId,
      businessType,
      gstNumber,
      businessAddress,
      cityPincode,
      expectedMonthlyOrders,
      heardFrom,
    } = req.body;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: 'Business ID is required',
      });
    }

    // find existing business
    const business = await BusinessProfile.findById(businessId);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    // extract city & pincode 
    let city = '';
    let pincode = '';

    const pinMatch = cityPincode?.match(/\b\d{6}\b/);
    if (pinMatch) {
      pincode = pinMatch[0];
      city = cityPincode.replace(pincode, '').trim();
    } else {
      city = cityPincode;
    }

    // geocode
    const geo = await geocodeLocation(cityPincode);

    if (!geo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid city or pincode',
      });
    }

    // delivery availability (temporary logic)
    const serviceablePincodes = ['110001', '560001', '400001'];
    const deliveryAvailable = serviceablePincodes.includes(pincode);

    // update business profile
    business.businessType = businessType;
    business.gstNumber = gstNumber;
    business.businessAddress = businessAddress;
    business.city = city;
    business.pincode = pincode;
    business.lat = geo.lat;
    business.lng = geo.lng;
    business.expectedMonthlyOrders = expectedMonthlyOrders;
    business.heardFrom = heardFrom;
    business.deliveryAvailable = deliveryAvailable;

    await business.save();

    // respond
    res.status(200).json({
      success: true,
      message: 'Step 2 completed',
      deliveryAvailable,
    });

  } catch (error) {
    console.error('Step 2 error:', error);
    res.status(500).json({
      success: false,
      message: 'Step 2 failed',
    });
  }
};

module.exports = { registerBusinessStep1, registerBusinessStep2, }