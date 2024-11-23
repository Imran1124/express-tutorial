const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const houseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: null
    },
    houseName: {
      type: String,
      required: true
    },
    houseType: {
      type: String,
      required: true
    },
    houseAddress: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

houseSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('houses', houseSchema);
