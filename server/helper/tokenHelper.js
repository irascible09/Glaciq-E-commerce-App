const JWT = require('jsonwebtoken')

const generateAccessToken = (userId) => {
    return JWT.sign(
        { _id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }   // short lived
    )
}

const generateRefreshToken = (userId) => {
    return JWT.sign(
        { _id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '90d' }   // long lived
    )
}

module.exports = { generateAccessToken, generateRefreshToken }
