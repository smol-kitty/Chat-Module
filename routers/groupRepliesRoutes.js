const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupRepliesControllers");

router.post("/", controller.createReply);
router.get("/", controller.getAllReplies);
router.get("/group/:group_id", controller.getRepliesByGroup);
router.get("/user/:sender_type/:sender_id", controller.getRepliesByUser);
router.get("/chat/:chat_id", controller.getRepliesByChat);
router.get("/reply/:reply_id", controller.getByReplyId);
router.put("/reply/:reply_id", controller.updateReply);
router.delete("/reply/:reply_id", controller.deleteReply);

module.exports = router;
