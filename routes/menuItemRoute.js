const express = require('express');
const router = express.Router();
const MenuItem = require("../models/core/MenuItem")
const createGenericController = require('../controllers/utils/GenericController');

const menuItemController = createGenericController(MenuItem, {});

router.get('/', menuItemController.findAll);

module.exports = router;