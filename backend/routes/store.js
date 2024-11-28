const express = require('express');
const { create, details, update, remove, all, unapproved } = require('../controllers/store');
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isAllowed } = require('../middlewares/isAllowed');
const { isSuper } = require('../middlewares/isSuper');
const router = express.Router();

router.post('/', isAuthenticated, isAllowed, create);
router.get('/all', all);
router.get('/unapproved', isAuthenticated, isSuper, unapproved);
router.route('/:id')
        .get(isAuthenticated, isAllowed, details)
        .put(isAuthenticated, isAllowed, update)
        .delete(isAuthenticated, isAllowed, remove)

module.exports = router;