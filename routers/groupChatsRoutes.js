const express = require("express");
const router = express.Router();
const groupChatsController = require("../controllers/groupChatsControllers");

router.get("/", groupChatsController.getAll);
router.get("/group/:group_id", groupChatsController.getByGroup);
router.get("/user/:sender_type/:sender_id", groupChatsController.getByUser);
router.post("/", groupChatsController.create);
router.put("/chat/:chat_id", groupChatsController.update);
router.delete("/chat/:chat_id", groupChatsController.remove);

module.exports = router;
