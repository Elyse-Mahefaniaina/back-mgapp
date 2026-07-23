const express = require('express');
const router = express.Router();
const SiteActivite = require('../models/core/SiteActivite');
const createGenericController = require('../controllers/utils/GenericController');

const siteActiviteController = createGenericController(SiteActivite, {});

router.post('/', siteActiviteController.create);
router.get('/', siteActiviteController.findAll);
router.get('/metadata', siteActiviteController.metadata);
router.get('/:id', siteActiviteController.findOne);
router.put('/:id', siteActiviteController.update);
router.delete('/:id', siteActiviteController.remove);

module.exports = router;