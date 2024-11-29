const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true
    },
   status:{
    type:Number,
    default:1,
    
   }
  },
  {
    timestamps: true
  }
);
categorySchema.plugin(aggregatePaginate);
module.exports = mongoose.model('tbl_categoty_mstr', categorySchema);
