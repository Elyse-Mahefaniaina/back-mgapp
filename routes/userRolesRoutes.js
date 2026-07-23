const express = require('express');
const router = express.Router();
const UserRole = require('../models/user/UserRole');
const createGenericController = require('../controllers/utils/GenericController');

const userContactController = createGenericController(
  UserRole,
  {},
  [],
  [
    {
      field: "role_id",
      controller: "/api/roles",
      valueKey: "id",
      labelKey: "role"
    }
  ]
);

router.get("/", userContactController.findAll);
router.get("/metadata", userContactController.metadata);
router.get("/:id", userContactController.findOne);
router.post("/", userContactController.create);
router.put("/:id", userContactController.update);
router.delete("/:id", userContactController.remove);

module.exports = router;
