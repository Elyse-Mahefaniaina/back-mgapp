const express = require('express');
const router = express.Router();
const InventaireStock = require('../models/inventaire/inventaires');
const createGenericController = require('../controllers/utils/GenericController');

const inventaireController = createGenericController(
  InventaireStock,
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
    },
  ],
  [
    {
      field: "user_id",
      defaultValue: {
        type: "storage",
        storage: "localStorage",
        key: "user",
        path: "id"
      },
      isVisibleOnCreate: false
    },
    {
      field: "date_mvmt",
      defaultValue: {
        type: "now",
        format: "YYYY-MM-DD"
      },
      isVisibleOnCreate: true
    }
  ]
);

router.get("/", inventaireController.findAll);
router.get("/metadata", inventaireController.metadata);
router.get("/:id", inventaireController.findOne);
router.post("/", inventaireController.create);

module.exports = router;
