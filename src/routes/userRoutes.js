const express = require('express');
const userController = require('../controller/user.controller');

const router = express.Router();

// Get all users

router.post('/register', userController.register);

module.exports = router;
