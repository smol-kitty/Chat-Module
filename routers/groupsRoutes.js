const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupsControllers");

router.get("/", controller.getGroups);
router.get("/user/:creator_type/:created_by", controller.getGroupsByCreator);
router.get("/group/:id", controller.getGroup);
router.post("/", controller.createGroup);
router.put("/group/:id", controller.updateGroup);
router.delete("/group/:id", controller.deleteGroup);

module.exports = router;
