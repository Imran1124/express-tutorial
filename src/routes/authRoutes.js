const express = require('express');
const userController = require('../controller/auth.controller');

const router = express.Router();

// Get all users

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
