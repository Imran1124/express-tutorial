const express = require('express');
const _middleware = require('../middleware/_middleware');

const authRoutes = require('./authRoutes');
const crudRoutes = require('./crudroutes');
const userRoutes = require('./userRoutes');
const houseRouter = require('./houseRoutes');
const modelRouter = require('./modelMasterRoutes');
const categoryRouter = require('./categoryRoutes');
const brandRoutes = require('./brandRoutes');

const router = express.Router({ mergeParams: true });

router.use('/auth', authRoutes);

router.use(_middleware);
router.use('/user', userRoutes);
router.use('/crud', crudRoutes);
router.use('/house', houseRouter);
router.use('/model', modelRouter);
router.use('/house', houseRouter);
router.use('/category', categoryRouter);
router.use('/brand', brandRoutes);

module.exports = router;
