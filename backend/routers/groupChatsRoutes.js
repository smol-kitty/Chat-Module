const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupChatsControllers");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports = function (io) {
  const router = express.Router();

  router.get("/", controller.getAllChats);
  router.get("/group/:group_id", controller.getChatsByGroup);
  router.get("/user/:sender_type/:sender_id", controller.getChatsByUser);
  router.get("/chat/:chat_id", controller.getChatById);
  router.post("/", upload.array("files"), controller.createChat);
  router.put(
    "/chat/:chat_id",
    upload.array("files"),
    controller.updateChatMessage
  );
  router.delete("/chat/:chat_id", controller.deleteChat);

  // You can use io here, e.g. for emitting socket events
  // router.post("/", (req, res) => {
  //   // ... your logic
  //   io.to(`group_${req.body.group_id}`).emit("newMessage", message);
  // });

  return router;
};
