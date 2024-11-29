const mongoose = require('mongoose');
const Joi = require('joi');
const categoryModal = require('../model/category.model');


const createCategory = async (req, res) => {
    const { categoryName } = req.body;
  
    // Define validation schema
    const schema = Joi.object({
      categoryName: Joi.string().min(3).max(30).required().label('category Name'),
    });
  
    // Validate request body
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
  
    try {
      // Create and save the new categoryModal
      const categoryVar = new categoryModal({ categoryName });
      const result = await categoryVar.save();
  
      // Send success response
      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      // Handle unexpected errors
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };


  // get all categoryModals
const getcategory = async (req, res) => {
  try {
    
    const category = await categoryModal.find({});

    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

//// get single category by id
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryVar = await categoryModal.findById(id);

    if (!categoryVar) {
      return res.status(200).json({
        success: false,
        message: 'Category not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: categoryVar,
      message: 'Category found'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};

// delete category by id
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryVar = await categoryModal.findByIdAndDelete(id);

    if (!categoryVar) {
      return res.status(200).json({
        success: false,
        message: 'category not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'category deleted successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};

// update category by id with status 0 and 1
  const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName} = req.body;
    
  
    try {
      const categoryVar = await categoryModal.findByIdAndUpdate(
        id,
        {
          categoryName,
        },
        { new: true }
      );
  
      if (!categoryVar) {
        return res.status(200).json({
          success: false,
          message: 'Category not found'
        });
      }
  
      return res.status(200).json({
        success: true,
        data: categoryVar,
        message: 'Category updated successfully'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
    }
  };

  //update status by id 
  const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const categoryVar = await categoryModal.findByIdAndUpdate(
        id,
        {
          status,
        },
        { new: true }
      );
  
      if (!categoryVar) {
        return res.status(200).json({
          success: false,
          message: 'Category not found'
        });
      }
  
      return res.status(200).json({
        success: true,
        data: categoryVar,
        message: 'Status updated successfully'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
    }
  };



  
module.exports = {
    createCategory,
    getcategory,
    getCategoryById,
    deleteCategory,
    updateCategory,
    updateStatus
    
  };