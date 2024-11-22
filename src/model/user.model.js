const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    roleId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles',
      default: null
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    address: {
      type: String
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('users', userSchema);
