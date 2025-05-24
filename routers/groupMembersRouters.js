const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupMembersControllers");

router.post("/", controller.createGroupMember);
router.put(
  "/user/:member_type/:member_id/:group_id",
  controller.updateGroupMember
);
router.delete(
  "/user/:member_type/:member_id/:group_id",
  controller.deleteGroupMember
);

router.get("/", controller.getAllMembers);
router.get("/group/:group_id", controller.getGroupMembers);
router.get("/user/:member_type/:member_id", controller.getUserGroups);

module.exports = router;
