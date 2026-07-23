const express = require('express');
const router = express.Router();
const PrixVente = require("../models/vente/PrixVente");
const createGenericController = require('../controllers/utils/GenericController');

const achatController = createGenericController(
  PrixVente,
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

router.get("/", achatController.findAll);
router.get("/metadata", achatController.metadata);
router.get("/:id", achatController.findOne);
router.post("/", achatController.create);
router.put("/:id", achatController.update);
router.delete("/:id", achatController.remove);

module.exports = router;

