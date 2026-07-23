const express = require('express');
const router = express.Router();
const Page = require("../models/core/page")
const createGenericController = require('../controllers/utils/GenericController');

const pageController = createGenericController(Page, {});

router.get('/', pageController.findAll);
router.get('/metadata', pageController.metadata);

module.exports = router;