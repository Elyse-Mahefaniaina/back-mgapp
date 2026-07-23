const express = require('express');
const router = express.Router();
const Fournisseur = require('../models/fournisseur/Fournisseur');
const createGenericController = require('../controllers/utils/GenericController');

const fournisseurController = createGenericController(
  Fournisseur,
  {},
);

router.get("/", fournisseurController.findAll);
router.get("/metadata", fournisseurController.metadata);
router.get("/:id", fournisseurController.findOne);
router.post("/", fournisseurController.create);
router.put("/:id", fournisseurController.update);
router.delete("/:id", fournisseurController.remove);

module.exports = router;
