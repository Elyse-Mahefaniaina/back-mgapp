const express = require('express');
const router = express.Router();
const ProduitFournisseur = require("../models/produit/ProduitFournisseur");
const createGenericController = require('../controllers/utils/GenericController');

const produitFournisseurController = createGenericController(
  ProduitFournisseur,
  {},
  [],
  [
    {
      field: "fournisseur_id",
      controller: "/api/fournisseurs",
      valueKey: "id",
      labelKey: "identifiant"
    }
  ]
);

router.get("/", produitFournisseurController.findAll);
router.get("/metadata", produitFournisseurController.metadata);
router.get("/:id", produitFournisseurController.findOne);
router.post("/", produitFournisseurController.create);
router.put("/:id", produitFournisseurController.update);
router.delete("/:id", produitFournisseurController.remove);

module.exports = router;