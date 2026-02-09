const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "add name"],
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 10,
    },

    email: {
      type: String,
      required: [true, "add email"],
      unique: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      trim: true,
      min: 6,
      max: 64,
    },

    // Profile picture (from Google/Apple)
    picture: {
      type: String,
      trim: true,
    },

    // for Google users
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null values
    },

    // apple users
    appleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authType: {
      type: String,
      enum: ["local", "google", "apple"],
      default: "local",
    },

    role: {
      type: String,
      enum: ['User', 'ADMIN'],
      default: 'User',
    },

    refreshToken: {
      type: String,
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },

    businessName: {
      type: String,
      trim: true,
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
