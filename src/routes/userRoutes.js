const express = require('express');
const userController = require('../controller/user.controller');

const router = express.Router();

router.post('/create', userController.createUser);
router.get('/get-user', userController.getUsers);
router.get('/get-user-by-id/:id', userController.getUserById);
router.put('/get-user-by-id/:id', userController.updateUser);
router.delete('/del-user-by-id/:id', userController.deleteUser);
router.get('/get-all-log', userController.getLogs);
router.get('/get-log-by-id/:id', userController.getLogById);
router.get('/get-log-by-userId/:id', userController.getLogByUserId);

module.exports = router;
