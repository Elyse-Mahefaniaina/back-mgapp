const express = require('express');
const router = express.Router();
const User = require('../models/user/User');
const createGenericController = require('../controllers/utils/GenericController');

const userController = createGenericController(
  User,
  {},
  ["password"]
);

router.get("/", userController.findAll);
router.get("/metadata", userController.metadata);
router.get("/:id", userController.findOne);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);

module.exports = router;
