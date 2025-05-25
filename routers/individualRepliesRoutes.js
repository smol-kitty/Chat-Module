const express = require("express");
const router = express.Router();
const controller = require("../controllers/individualRepliesControllers");

router.post("/", controller.createReply);
router.get("/", controller.getAllReplies);
router.get("/chat/:parent_id", controller.getRepliesByChat);
router.get("/reply/:reply_id", controller.getReplyById);
router.get("/user/:sender_type/:sender_id", controller.getRepliesByUser);
router.put("/reply/:reply_id", controller.updateReply);
router.delete("/reply/:reply_id", controller.deleteReply);

module.exports = router;
