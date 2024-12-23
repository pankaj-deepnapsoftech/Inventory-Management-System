const express = require('express');
const { all, details } = require('../controllers/scrap');
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const router = express.Router();

router.get('/all', isAuthenticated, all);
router.get('/:id', isAuthenticated, details);

module.exports = router;