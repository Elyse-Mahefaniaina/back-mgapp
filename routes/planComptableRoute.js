const express = require('express');
const router = express.Router();
const PlanComptable = require('../models/comptabilite/PlanComptable');
const createGenericController = require('../controllers/utils/GenericController');

const planComptableController = createGenericController(
  PlanComptable,
  {},
  []
);

router.get("/", planComptableController.findAll);
router.get("/metadata", planComptableController.metadata);
router.get("/:id", planComptableController.findOne);
router.post("/", planComptableController.create);
router.put("/:id", planComptableController.update);
router.delete("/:id", planComptableController.remove);

module.exports = router;