const express = require('express');
const router = express.Router();
const ContactFournisseur = require('../models/fournisseur/ContactFournisseur');
const createGenericController = require('../controllers/utils/GenericController');

const contactFournisseurController = createGenericController(
  ContactFournisseur,
  {},
  []
);

router.get("/", contactFournisseurController.findAll);
router.get("/metadata", contactFournisseurController.metadata);
router.get("/:id", contactFournisseurController.findOne);
router.post("/", contactFournisseurController.create);
router.put("/:id", contactFournisseurController.update);
router.delete("/:id", contactFournisseurController.remove);

module.exports = router;