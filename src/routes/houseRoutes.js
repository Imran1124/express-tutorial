const express = require('express');
const houseController = require('../controller/house.controller');

const router = express.Router();

// Get all users

router.post('/create-house', houseController.createHouse);
router.get('/get-all-house', houseController.getAllhouse);
router.get('/get-all-house-by-user', houseController.getAllhouseByUser);
router.get('/get-all-without-by-user', houseController.withoutAggrigate);

module.exports = router;
