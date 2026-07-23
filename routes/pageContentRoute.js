const express = require('express');
const router = express.Router();
const PageContent = require("../models/core/pageContent")
const createGenericController = require('../controllers/utils/GenericController');

const pageContentController = createGenericController(PageContent, {});

router.get('/', pageContentController.findAll);
router.post('/', pageContentController.create)
router.get('/metadata', pageContentController.metadata);

module.exports = router;