const express = require("express");
const { update, create, remove, details, allBuyers, unapprovedBuyers, unapprovedSuppliers, allSuppliers } = require("../controllers/agent");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isAllowed } = require("../middlewares/isAllowed");
const { isSuper } = require("../middlewares/isSuper");
const router = express.Router();

router.post('/', isAuthenticated, isAllowed, create);
router.get('/buyers', allBuyers);
router.get('/suppliers', allSuppliers);
router.get('/unapproved-buyers', isAuthenticated, isSuper, unapprovedBuyers);
router.get('/unapproved-suppliers', isAuthenticated, isSuper, unapprovedSuppliers);
router.route('/:id')
        .put(isAuthenticated, isAllowed, update)
        .delete(isAuthenticated, isAllowed, remove)
        .get(isAuthenticated, isAllowed, details)

module.exports = router;