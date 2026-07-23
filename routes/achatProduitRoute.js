const express = require('express');
const router = express.Router();
const AchatProduit = require('../models/achat/AchatProduit')
const createGenericController = require('../controllers/utils/GenericController');

const achatProduitController = createGenericController(
  AchatProduit,
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
  [
    {
      field: "date",
      defaultValue: {
        type: "now",
        format: "YYYY-MM-DD"
      },
      isVisibleOnCreate: true
    },
    {
      field: "achat_id",
      defaultValue: {
        type: "bind",
        storage: "urlParam",
        key: "selected",
      },
      isVisibleOnCreate: false
    },
  ]
);

router.get("/", achatProduitController.findAll);
router.get("/metadata", achatProduitController.metadata);
router.get("/:id", achatProduitController.findOne);
router.post("/", achatProduitController.create);
router.put("/:id", achatProduitController.update);
router.delete("/:id", achatProduitController.remove);

module.exports = router;
