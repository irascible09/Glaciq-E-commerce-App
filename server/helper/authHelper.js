const bcrypt = require('bcrypt')

// password hashing
exports.hashpassword = async (password) => {
    const salt = await bcrypt.genSalt(12)
    return bcrypt.hash(password, salt)
}

// password compare
exports.comparepassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

// refresh token hashing
exports.hashToken = async (token) => {
    const salt = await bcrypt.genSalt(12)
    return bcrypt.hash(token, salt)
}

// refresh token compare
exports.compareToken = async (token, hashedToken) => {
    return bcrypt.compare(token, hashedToken)
}
