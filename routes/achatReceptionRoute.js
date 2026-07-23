const express = require('express');
const router = express.Router();
const AchatReception = require("../models/achat/AchatReception");
const createGenericController = require('../controllers/utils/GenericController');
const { getReceiptData } = require('../controllers/receiptCustomController');

const achatReceptionController = createGenericController(
  AchatReception,
);

router.get("/", achatReceptionController.findAll);
router.get("/metadata", achatReceptionController.metadata);
router.get("/receipts/:id", getReceiptData);
router.get("/:id", achatReceptionController.findOne);
router.post("/", achatReceptionController.create);
router.put("/:id", achatReceptionController.update);
router.delete("/:id", achatReceptionController.remove);

module.exports = router;

