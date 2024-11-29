const express = require('express');
const categoryController = require('../controller/category.controller');

const router = express.Router();

// Get all users

router.post('/create-category', categoryController.createCategory);
router.get('/get-category', categoryController.getcategory);
router.get('/get-category-by-id/:id', categoryController.getCategoryById);
router.delete('/del-category-by-id/:id', categoryController.deleteCategory);
router.put('/update-category-by-id/:id', categoryController.updateCategory);
router.put('/update-status-category-by-id/:id', categoryController.updateStatus);


module.exports = router;
