const express = require('express');
const userController = require('../controller/auth.controller');

const router = express.Router();

// Get all users

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/send-otp', userController.sendOtpViaEmail);
router.post('/verify-otp', userController.verifyOtp);
router.post('/register-email', userController.registerUserViaOtp);

module.exports = router;
