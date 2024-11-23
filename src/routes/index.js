const express = require('express');
const _middleware = require('../middleware/_middleware');

const authRoutes = require('./authRoutes');
const crudRoutes = require('./crudroutes');
const userRoutes = require('./userRoutes');

const router = express.Router({ mergeParams: true });

router.use('/auth', authRoutes);

router.use(_middleware);
router.use('/user', userRoutes);
router.use('/crud', crudRoutes);

module.exports = router;
