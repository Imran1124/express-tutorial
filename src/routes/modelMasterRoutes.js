const express = require('express');
const modelController = require('../controller/modelController');

const router = express.Router();

// Get all users
router.post('/create-model', modelController.CreateModel); 
router.get('/get-all-model', modelController.GetAllModel); 
router.put('/update-model/:id', modelController.UpdateModel);
router.delete('/delete-model/:id', modelController.DeleteModel);
router.get('/get-model-by-id/:id', modelController.GetModelById); 
router.put('/update-model-status/:id', modelController.UpdateModelStatus);

module.exports = router;
