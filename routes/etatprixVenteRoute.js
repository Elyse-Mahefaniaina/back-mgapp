const express = require('express');
const router = express.Router();
const EtatPrixVente = require("../models/vente/EtatPrixVente");
const createGenericController = require('../controllers/utils/GenericController');

const etatPrixVenteController = createGenericController(
  EtatPrixVente,
  {},
  [],
  [
    {
      field: "produit_id",
      controller: "/api/produits",
      valueKey: "id",
      labelKey: "identifiant"
    },
    {
      field: "site_id",
      controller: "/api/site",
      valueKey: "id",
      labelKey: "numero"
    }
  ],
);

router.get("/", etatPrixVenteController.findAll);
router.get("/metadata", etatPrixVenteController.metadata);

module.exports = router;

