const model = require("../models/groupChatsModel");

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

    if (tagged && !Array.isArray(tagged)) {
      return res.status(400).json({ error: "Tagged must be an array" });
    }

    if (tagged) {
      for (const t of tagged) {
        if (
          typeof t !== "object" ||
          typeof t.member_type !== "number" ||
          typeof t.member_id !== "number"
        ) {
          return res.status(400).json({ error: "Invalid tagged user format" });
        }
      }
    }

    const validSender = await model.validateSender(sender_type, sender_id);
    const validGroup = await model.validateGroupExists(receiver_id);
    const validTagged = await model.validateTaggedUsers(
      receiver_id,
      tagged || []
    );
    if (!validSender || !validGroup || !validTagged) {
      return res
        .status(400)
        .json({ error: "Invalid sender, group or tagged users" });
    }

    const chat_id = await model.createChat(
      sender_type,
      sender_id,
      receiver_id,
      message,
      tagged || []
    );

    res.status(201).json({ message: "Message sent", chat_id });
  } catch (err) {
    console.error("Create Chat Error:", err);
    res.status(400).json({ error: err.message });
  }
};

const updateChatMessage = async (req, res) => {
  try {
    const chat_id = parseInt(req.params.chat_id);
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const success = await model.updateMessage(chat_id, message);
    if (!success) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ message: "Message updated" });
  } catch (err) {
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
