const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const ModelSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tbl_category_mstr',
      path: '_id',
    },
    modelName: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      default: 1
    },
  },
  {
    timestamps: true
  }
);

ModelSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('tbl_model_mstrs', ModelSchema);
