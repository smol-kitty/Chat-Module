const express = require("express");
const router = express.Router();
const controller = require("../controllers/individualChatsControllers");

// POST
router.post("/", controller.createChat);

// GET
router.get("/", controller.getAllChats); // ?mode=present|past|all
router.get("/user/:member_type/:member_id", controller.getChatsByUser); // ?mode=present|past|all
router.get("/chat/:chat_id", controller.getChatById);

// PUT
router.put("/chat/:chat_id", controller.updateChat);

// DELETE
router.delete("/chat/:chat_id", controller.deleteChat);

module.exports = router;
