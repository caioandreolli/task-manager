const express = require('express');

const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.render('private/admin-dashboard');
});

module.exports = router;
