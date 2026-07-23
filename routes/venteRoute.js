const express = require('express');
const router = express.Router();
const { createSalesCompleted } = require('../controllers/salesCustomController');

router.post('/', createSalesCompleted);

module.exports = router;
