const express = require('express');
const userController = require('../controller/user.controller');

const router = express.Router();

router.post('/create', userController.createUser);
router.get('/get-user', userController.getUsers);

module.exports = router;
