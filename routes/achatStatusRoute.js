const express = require('express');
const router = express.Router();
const AchatStatus = require("../models/achat/AchatStatus");
const createGenericController = require('../controllers/utils/GenericController');

const achatStatusController = createGenericController(
  AchatStatus
);

router.get("/", achatStatusController.findAll);
router.get("/metadata", achatStatusController.metadata);
router.post("/", achatStatusController.create);

module.exports = router;

