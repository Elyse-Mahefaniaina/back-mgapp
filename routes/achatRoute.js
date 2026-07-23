const express = require('express');
const router = express.Router();
const Achat = require("../models/achat/Achat");
const createGenericController = require('../controllers/utils/GenericController');
const { getPurchaseCreate, getPurchaseData } = require('../controllers/purchaseCustomController');

const achatController = createGenericController(
  Achat,
  {},
  [],
  [
    {
      field: "fournisseur_id",
      controller: "/api/fournisseurs",
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
  [
    {
      field: "date",
      defaultValue: {
        type: "now",
        format: "YYYY-MM-DD"
      },
      isVisibleOnCreate: true
    }
  ]
);

router.get("/", achatController.findAll);
router.get("/metadata", achatController.metadata);
router.get("/create", getPurchaseCreate);
router.get("/suivi", getPurchaseData);
router.get("/create/metadata", achatController.metadata);
router.get("/:id", achatController.findOne);
router.post("/", achatController.create);
router.put("/:id", achatController.update);
router.delete("/:id", achatController.remove);

module.exports = router;

