const express = require('express');
const router = express.Router();
const Produits = require("../models/produit/Produits");
const createGenericController = require('../controllers/utils/GenericController');
const { getProduitsBySite } = require('../controllers/productCustomController');

const ProduitsController = createGenericController(
  Produits,
  {},
);

router.get("/", ProduitsController.findAll);
router.get("/metadata", ProduitsController.metadata);
router.get("/in-stock/:site_id", getProduitsBySite);
router.get("/:id", ProduitsController.findOne);
router.post("/", ProduitsController.create);
router.put("/:id", ProduitsController.update);
router.delete("/:id", ProduitsController.remove);

module.exports = router;