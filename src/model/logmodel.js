const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    userLog: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('logs', logSchema);
