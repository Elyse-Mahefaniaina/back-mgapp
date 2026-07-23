const express = require('express');
const router = express.Router();
const ContactClient = require('../models/client/ContactClient');
const createGenericController = require('../controllers/utils/GenericController');

const clientContactController = createGenericController(
  ContactClient,
  {},
  []
);

router.get("/", clientContactController.findAll);
router.get("/metadata", clientContactController.metadata);
router.get("/:id", clientContactController.findOne);
router.post("/", clientContactController.create);
router.put("/:id", clientContactController.update);
router.delete("/:id", clientContactController.remove);

module.exports = router;