const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String
    },
    otp: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 300 }
    }
  },
  { timestamps: true }
);

const otpModel = mongoose.models.OTPModel || mongoose.model('otp', otpSchema);

module.exports = otpModel;
