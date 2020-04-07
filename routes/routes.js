const express = require('express');

const apiRoutes = require('./apiRoutes/apiRoutes.routes');
const mvcRoutes = require('./mvcRoutes/mvcRoutes.routes');

const router = express.Router();

router.use('/api', apiRoutes);
router.use('/', mvcRoutes);

module.exports = router;
