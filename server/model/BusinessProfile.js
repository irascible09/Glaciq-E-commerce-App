const mongoose = require("mongoose");

const businessProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  businessName: String,
  businessType: String,
  gstNumber: String,
  businessAddress: String,
  city: String,
  pincode: String,

  lat: Number,
  lng: Number,
  deliveryAvailable: Boolean,

  expectedMonthlyOrders: String,
  heardFrom: String,

  verificationStatus: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'draft',
  },
}, { timestamps: true });


module.exports = mongoose.model('BusinessProfile', businessProfileSchema)