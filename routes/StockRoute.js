const express = require('express');
const router = express.Router();
const Stock = require('../models/stock/StockProduitMvmt');
const createGenericController = require('../controllers/utils/GenericController');

const produitFournisseurController = createGenericController(
  Stock,
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
    },
    {
      field: "user_id",
      controller: "/api/users",
      valueKey: "id",
      labelKey: "matricule"
    }
  ]
);

router.get("/", produitFournisseurController.findAll);
router.get("/metadata", produitFournisseurController.metadata);


module.exports = router;