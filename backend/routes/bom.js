const express = require('express');
const { create, unapproved, update, remove, details, all } = require('../controllers/bom');
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const { isAllowed } = require('../middlewares/isAllowed');
const { isSuper } = require('../middlewares/isSuper');
const router = express.Router();

router.post('/', isAuthenticated, isAllowed, create);
router.get('/all', all);
router.get('/unapproved', isAuthenticated, isSuper, unapproved);
router.route('/:id')
        .put(isAuthenticated, isAllowed, update)
        .delete(isAuthenticated, isAllowed, remove)
        .get(isAuthenticated, isAllowed, details)
// router.delete('/remove/raw-material/:id', isAuthenticated, removeRawMaterial);
// router.delete('/remove/finished-good/:id', isAuthenticated, removeFinishedGood);

module.exports = router;