const express = require('express');
const router = express.Router();
const EtatStock = require('../models/stock/EtatStock');
const createGenericController = require('../controllers/utils/GenericController');

const etatStockController = createGenericController(
  EtatStock,
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
  ]
);

router.get("/", etatStockController.findAll);
router.get("/metadata", etatStockController.metadata);


module.exports = router;