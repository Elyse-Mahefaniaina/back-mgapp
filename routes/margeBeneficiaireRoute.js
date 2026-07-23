const express = require('express');
const router = express.Router();
const MargeBeneficiaire = require("../models/vente/MargeBeneficiaire");
const createGenericController = require('../controllers/utils/GenericController');

const achatController = createGenericController(
  MargeBeneficiaire,
  {},
  [],
  [
    {
      field: "produit_id",
      controller: "/api/produits",
      valueKey: "id",
      labelKey: "identifiant"
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

