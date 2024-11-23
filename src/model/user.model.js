const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    roleId: {
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
      type: String
    }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('users', userSchema);
