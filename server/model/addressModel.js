const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: String,
  phone: String,
  line1: { type: String, required: true },
  line2: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Address', addressSchema)
