const express = require('express');

const publicRoutes = require('./public/publicRoutes');
const authRoutes = require('./public/authRoutes');
const taskRoutes = require('./private/taskRoutes');
const subTaskRoutes = require('./private/subTaskRoutes');
const adminRoutes = require('./private/adminRoutes');

const { authRequiredMiddleware, validateAdminUser } = require('../../middlewares/authMiddlewares');

const router = express.Router();

// public routes
router.use('/', publicRoutes);
router.use('/auth', authRoutes);

// private routes middleware
router.use(authRequiredMiddleware)

// private routes
router.use('/task', taskRoutes);
router.use('/sub-task', subTaskRoutes);

// admin routes middleware
router.use(validateAdminUser);

//admin routes
router.use('/admin', adminRoutes);

module.exports = router;
