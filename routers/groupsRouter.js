const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupsControllers");

router.post("/", groupController.createGroup);
router.get("/", groupController.getAllGroups);
router.get("/all", groupController.getAllGroupsIncludingDeleted);
router.get("/id/:id", groupController.getGroupById);
router.put("/id/:id", groupController.updateGroup);
router.delete("/id/:id", groupController.deleteGroup);

module.exports = router;
