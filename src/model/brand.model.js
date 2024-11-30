const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const brandSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tbl_category_mstrs',
      required: true
    },
    brandName: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);
brandSchema.plugin(aggregatePaginate);
module.exports = mongoose.model('tbl_brand_mstrs', brandSchema);
