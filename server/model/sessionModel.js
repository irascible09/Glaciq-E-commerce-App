const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refreshTokenHash: {
    type: String,
    required: true,
  },
  device: String,
  ip: String,
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true })

module.exports = mongoose.model('Session', sessionSchema)
