const mongoose = require('mongoose');

const CrudSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
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
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('cruds', CrudSchema);
