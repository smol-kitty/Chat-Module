const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupChatsControllers");

router.get("/", controller.getAllChats);
router.get("/group/:group_id", controller.getChatsByGroup);
router.get("/user/:sender_type/:sender_id", controller.getChatsByUser);
router.get("/chat/:chat_id", controller.getChatById);
router.post("/", controller.createChat);
router.put("/chat/:chat_id", controller.updateChatMessage);
router.delete("/chat/:chat_id", controller.deleteChat);

module.exports = router;
