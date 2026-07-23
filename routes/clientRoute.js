const express = require('express');
const router = express.Router();
const Client = require('../models/client/Client');
const createGenericController = require('../controllers/utils/GenericController');

const clientController = createGenericController(
  Client,
  {},
  []
);

router.get("/", clientController.findAll);
router.get("/metadata", clientController.metadata);
router.get("/:id", clientController.findOne);
router.post("/", clientController.create);
router.put("/:id", clientController.update);
router.delete("/:id", clientController.remove);

module.exports = router;