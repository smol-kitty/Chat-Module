const model = require("../models/groupChatsModel");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { getNextPhotoId } = require("../models/photoCounterModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/groupchats");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: async (req, file, cb) => {
    try {
      const id = await getNextPhotoId();
      const ext = path.extname(file.originalname);
      cb(null, `${id}${ext}`);
    } catch (err) {
      cb(err);
    }
  },
});

const upload = multer({ storage }).array("files", 10);

const getAllChats = async (req, res) => {
  try {
    const mode = req.query.mode || "present";
    const [rows] = await model.getAllChats(mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getChatsByGroup = async (req, res) => {
  try {
    const group_id = parseInt(req.params.group_id);
    const mode = req.query.mode || "present";
    const [rows] = await model.getChatsByGroup(group_id, mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getChatsByUser = async (req, res) => {
  try {
    const sender_type = parseInt(req.params.sender_type);
    const sender_id = parseInt(req.params.sender_id);
    const mode = req.query.mode || "present";
    const [rows] = await model.getChatsByUser(sender_type, sender_id, mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getChatById = async (req, res) => {
  try {
    const chat_id = parseInt(req.params.chat_id);
    const [rows] = await model.getChatById(chat_id);
    if (rows.length === 0) {
      res.status(404).json({ message: "Chat not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createChat = async (req, res) => {
  try {
    const { sender_type, sender_id, receiver_id, message, tagged } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const parsedTagged = tagged ? JSON.parse(tagged) : [];

    const validSender = await model.validateSender(sender_type, sender_id);
    const validGroup = await model.validateGroupExists(receiver_id);
    const validTagged = await model.validateTaggedUsers(
      receiver_id,
      parsedTagged
    );

    if (!validSender || !validGroup || !validTagged) {
      return res
        .status(400)
        .json({ error: "Invalid sender, group, or tagged users" });
    }

    const fileNames = req.files?.map((f) => path.basename(f.filename)) || [];

    const chat_id = await model.createChat(
      sender_type,
      sender_id,
      receiver_id,
      message,
      parsedTagged,
      fileNames
    );

    res
      .status(201)
      .json({ message: "Message sent", chat_id, files: fileNames });
  } catch (err) {
    console.error("Create Chat Error:", err);
    res.status(400).json({ error: err.message });
  }
};

const safeParseJSON = (input) => {
  if (!input || input === "") return [];
  try {
    return typeof input === "string" ? JSON.parse(input) : input;
  } catch {
    return [];
  }
};

const updateChatMessage = async (req, res) => {
  try {
    const chat_id = parseInt(req.params.chat_id);
    const { message, tagged } = req.body;
    const filesUploaded =
      req.files?.map((f) => path.basename(f.filename)) || [];

    // Fetch existing chat
    const [existingRows] = await model.getChatById(chat_id);
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }
    const existingChat = existingRows[0];

    // Prepare new values or fallback to existing ones
    const newMessage = message?.trim() || existingChat.message;

    // Safe parse tagged
    const incomingTagged = safeParseJSON(tagged);
    const existingTagged = existingChat.tagged
      ? JSON.parse(existingChat.tagged)
      : [];
    const newTagged = tagged !== undefined ? incomingTagged : existingTagged;

    const newFiles =
      filesUploaded.length > 0
        ? filesUploaded
        : existingChat.files
        ? JSON.parse(existingChat.files)
        : [];

    if (!newMessage || newMessage.length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const success = await model.updateMessage(
      chat_id,
      newMessage,
      newTagged,
      newFiles
    );

    if (!success) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ message: "Message updated", files: newFiles });
  } catch (err) {
    console.error("Update Chat Error:", err);
    res.status(400).json({ error: err.message });
  }
};

const deleteChat = async (req, res) => {
  try {
    const chat_id = parseInt(req.params.chat_id);
    const now = new Date();
    const success = await model.deleteChat(chat_id, now);
    if (!success) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllChats,
  getChatsByGroup,
  getChatsByUser,
  getChatById,
  createChat,
  updateChatMessage,
  deleteChat,
};
