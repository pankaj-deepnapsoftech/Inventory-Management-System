const express = require('express');
const { create, all, details, update, remove } = require('../controllers/proformaInvoice');
const router = express.Router();

router.post('/', create);
router.get('/all', all);
router.route('/:_id')
        .get(details)
        .put(update)
        .delete(remove)

module.exports = router;