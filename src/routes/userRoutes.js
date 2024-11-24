const express = require('express');
const userController = require('../controller/user.controller');

const router = express.Router();

// Get all users

router.get('/get-user', userController.getUser);
router.get('/get-all-user', userController.getAllUser);

module.exports = router;
