const express = require("express");
const { create, update, remove, details, all, unapproved } = require("../controllers/product");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isSuper } = require("../middlewares/isSuper");
const { isAllowed } = require("../middlewares/isAllowed");
const router = express.Router();

router.route("/").post(isAuthenticated, isAllowed, create).put(isAuthenticated, isAllowed, update).delete(isAuthenticated, isAllowed, remove);
router.get("/all", all);
router.get("/unapproved", isAuthenticated, isSuper, unapproved);
router.get("/:id", isAuthenticated, isAllowed, details);

module.exports = router;
