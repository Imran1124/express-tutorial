const mongoose = require('mongoose');
const Joi = require('joi');
const brandModel = require('../model/brand.model');
const categoryModel = require('../model/category.model');

// create brand
const createBrand = async (req, res) => {
  const { categoryId, brandName } = req.body;

  // Define validation schema
  const schema = Joi.object({
    categoryId: Joi.string().required().label('Category Id'),
    brandName: Joi.string().min(3).max(30).required().label('Brand Name')
  });

  // Validate request body
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  try {
    // Create and save the new brandModel
    const brandVar = new brandModel({ categoryId, brandName });
    const result = await brandVar.save();

    // Send success response
    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (err) {
    // Handle unexpected errors
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// get all brandModels
const getAllBrand = async (req, res) => {
  const { page, limit, q } = req.query;
  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10
  };
  const query = [
    {
      $sort: {
        ctreatedAt: -1
      }
    }
  ];
  if (q) {
    query.push({
      $match: {
        brandName: { $regex: new RegExp(q, 'i') }
      }
    });
  }
  try {
    const brandData = categoryModel.aggregate([
      ...query,
      {
        $lookup: {
          from: 'tbl_brand_mstrs',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'brand'
        }
      }
      //   {
      //     $unwind: {
      //       path: '$category'
      //     }
      //   }
      //   {
      //     $project: {
      //       _id: 1,
      //       categoryName: 1,
      //       brand: {
      //         _id: 1,
      //         brandName: 1
      //       }
      //     }
      //   }
    ]);
    const brandPaginate = await categoryModel.aggregatePaginate(
      brandData,
      options
    );
    return res.status(200).json({
      success: true,
      data: brandPaginate,
      message: 'Brand retrieved successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// get brand by id
const getBrandById = async (req, res) => {
  const { id } = req.params;

  try {
    const brandVar = await brandModel.findById(id);

    if (!brandVar) {
      return res.status(200).json({
        success: false,
        message: 'Brand not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: brandVar,
      message: 'Brand found'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// update brand
const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { categoryId, brandName } = req.body;

  // Define validation schema
  const schema = Joi.object({
    categoryId: Joi.string().required().label('Category Id'),
    brandName: Joi.string().min(3).max(30).required().label('Brand Name')
  });

  // Validate request body
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  try {
    const brandVar = await brandModel.findById(id);

    if (!brandVar) {
      return res.status(200).json({
        success: false,
        message: 'Brand not found'
      });
    }

    brandVar.categoryId = categoryId;
    brandVar.brandName = brandName;

    const result = await brandVar.save();

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Brand updated successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// update brand status if 1 to 0 and 0 to 1
const updateBrandStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const brandVar = await brandModel.findById(id);

    if (!brandVar) {
      return res.status(200).json({
        success: false,
        message: 'Brand not found'
      });
    }

    brandVar.status = brandVar.status === 1 ? 0 : 1;
    const result = await brandVar.save();

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Brand status updated successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
  updateBrandStatus
};
