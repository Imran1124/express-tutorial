const express = require('express');

const userRoutes = require('./userRoutes');
const crudRoutes = require('./crudroutes');

const router = express.Router({ mergeParams: true });

router.use('/user', userRoutes);
router.use('/crud', crudRoutes);

module.exports = router;
