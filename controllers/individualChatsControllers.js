const model = require("../models/individualChatsModel");

const createChat = async (req, res) => {
  try {
    const {
      sender_type,
      sender_id,
      receiver_type,
      receiver_id,
      message,
      tagged,
    } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const validSender = await model.validateUser(sender_type, sender_id);
    const validReceiver = await model.validateUser(receiver_type, receiver_id);

    if (!validSender || !validReceiver) {
      return res.status(400).json({ error: "Invalid sender or receiver" });
    }

    const chat_id = await model.createChat(
      sender_type,
      sender_id,
      receiver_type,
      receiver_id,
      message,
      tagged === true
    );

    res.status(201).json({ message: "Chat created", chat_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllChats = async (req, res) => {
  try {
    const mode = req.query.mode || "present";
    const [rows] = await model.getAllChats(mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getChatsByUser = async (req, res) => {
  try {
    const { member_type, member_id } = req.params;
    const mode = req.query.mode || "present";
    const [rows] = await model.getChatsByUser(member_type, member_id, mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getChatById = async (req, res) => {
  try {
    const chat_id = Number(req.params.chat_id);
    if (isNaN(chat_id)) {
      return res.status(400).json({ error: "Invalid chat_id" });
    }

    const rows = await model.getChatById(chat_id);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateChat = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const { message, tagged } = req.body;

    if (!message || typeof tagged !== "boolean") {
      return res.status(400).json({ error: "Invalid message or tagged" });
    }

    const success = await model.updateChat(chat_id, message, tagged);
    if (!success)
      return res.status(404).json({ error: "Chat not found or unchanged" });

    res.json({ message: "Chat updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const deleted = await model.deleteChat(chat_id);
    if (!deleted) return res.status(404).json({ error: "Chat not found" });

    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createChat,
  getAllChats,
  getChatsByUser,
  getChatById,
  updateChat,
  deleteChat,
};
