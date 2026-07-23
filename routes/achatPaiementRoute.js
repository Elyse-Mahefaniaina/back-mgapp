const express = require('express');
const router = express.Router();
const AchatPaiement = require("../models/achat/AchatPaiement");
const createGenericController = require('../controllers/utils/GenericController');
const { getAchatsReceptionnes } = require('../controllers/paiementCustomController');

const achatController = createGenericController(
  AchatPaiement
);

router.post("/", achatController.create);
router.get("/", getAchatsReceptionnes)

module.exports = router;

