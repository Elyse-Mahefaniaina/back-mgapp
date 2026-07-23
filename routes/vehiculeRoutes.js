const express = require('express');
const router = express.Router();
const createGenericController = require('../controllers/utils/GenericController');
const vehicule = require('../models/transport/Vehicule');

const vehiculeController = createGenericController(
  vehicule,
  {},
  [],
  []
);

router.get("/", vehiculeController.findAll);
router.get("/metadata", vehiculeController.metadata);
router.get("/:id", vehiculeController.findOne);
router.post("/", vehiculeController.create);
router.put("/:id", vehiculeController.update);
router.delete("/:id", vehiculeController.remove);

module.exports = router;
