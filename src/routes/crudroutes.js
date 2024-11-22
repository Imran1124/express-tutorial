const express = require('express');
const crudController = require('../controller/crud.controller');
const router = express.Router();

router.post('/create', crudController.createUser);
router.get('/get-user', crudController.getUsers);
router.get('/get-user-by-id/:id', crudController.getUserById);
router.put('/get-user-by-id/:id', crudController.updateUser);
router.delete('/del-user-by-id/:id', crudController.deleteUser);
router.get('/get-all-log', crudController.getLogs);
router.get('/get-log-by-id/:id', crudController.getLogById);
router.get('/get-log-by-userId/:id', crudController.getLogByUserId);



module.exports = router;
