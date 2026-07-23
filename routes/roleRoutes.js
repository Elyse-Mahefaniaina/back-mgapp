const express = require('express');
const router = express.Router();
const Role = require('../models/user/Role');
const createGenericController = require('../controllers/utils/GenericController');

const roleController = createGenericController(Role, {});

router.get("/", roleController.findAll);
router.get("/metadata", roleController.metadata);
router.get("/:id", roleController.findOne);
router.post("/", roleController.create);
router.put("/:id", roleController.update);
router.delete("/:id", roleController.remove);

module.exports = router;
