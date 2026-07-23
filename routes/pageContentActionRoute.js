const express = require('express');
const router = express.Router();
const pageContentAction = require("../models/core/pageContentAction")
const createGenericController = require('../controllers/utils/GenericController');

const pageContentActionController = createGenericController(pageContentAction, {});

router.get('/', pageContentActionController.findAll);
router.post('/', pageContentActionController.create)
router.get('/metadata', pageContentActionController.metadata);

module.exports = router;