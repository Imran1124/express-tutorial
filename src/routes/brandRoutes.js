const express = require('express');
const brandCategory = require('../controller/brand.controller');

const router = express.Router();

// Get all users

router.post('/create-brand', brandCategory.createBrand);
router.get('/get-brand', brandCategory.getAllBrand);
router.get('/get-brand/:id', brandCategory.getBrandById);
router.put('/update-brand/:id', brandCategory.updateBrand);
router.put('/update-brand-status/:id', brandCategory.updateBrandStatus);

module.exports = router;
