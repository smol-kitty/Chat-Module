const model = require("../models/individualRepliesModel");

// ➕ Create a reply
const createReply = async (req, res) => {
  try {
    const { sender_type, sender_id, parent_id, message } = req.body;
    let { tagged } = req.body;

    // Default tagged to false if not provided
    if (tagged === undefined || tagged === null) {
      tagged = false;
    }

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const validSender = await model.validateSender(sender_type, sender_id);
    const validParent = await model.validateParentChat(
      parent_id,
      sender_type,
      sender_id
    );

    if (!validSender || !validParent) {
      return res.status(400).json({ error: "Invalid sender or parent chat" });
    }

    const reply_id = await model.createReply(
      sender_type,
      sender_id,
      parent_id,
      message,
      tagged
    );
    res.status(201).json({ message: "Reply sent", reply_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Get all replies (present | past | all)
const getAllReplies = async (req, res) => {
  const mode = req.query.mode || "present";
  const rows = await model.getAllReplies(mode);
  res.json(rows);
};

// 📄 Get replies by chat ID (parent_id)
const getRepliesByChat = async (req, res) => {
  const { parent_id } = req.params;
  const mode = req.query.mode || "present";
  const rows = await model.getRepliesByChat(parent_id, mode);
  res.json(rows);
};

// 📄 Get reply by reply_id
const getReplyById = async (req, res) => {
  const reply_id = Number(req.params.reply_id);
  if (isNaN(reply_id))
    return res.status(400).json({ error: "Invalid reply_id" });

  const rows = await model.getReplyById(reply_id);
  if (!rows || rows.length === 0)
    return res.status(404).json({ error: "Reply not found" });

  res.json(rows[0]);
};

// 📄 Get replies by user (sender_type, sender_id)
const getRepliesByUser = async (req, res) => {
  const { sender_type, sender_id } = req.params;
  const mode = req.query.mode || "present";
  const rows = await model.getRepliesByUser(sender_type, sender_id, mode);
  res.json(rows);
};

// ✏️ Update reply (only message & tagged)
const updateReply = async (req, res) => {
  try {
    const { reply_id } = req.params;
    const { message, tagged } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({ error: "Invalid message" });
    }

    const updated = await model.updateReply(reply_id, message, tagged);
    if (!updated)
      return res.status(404).json({ error: "Reply not found or unchanged" });

    res.json({ message: "Reply updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Soft delete reply
const deleteReply = async (req, res) => {
  try {
    const { reply_id } = req.params;
    const deleted = await model.deleteReply(reply_id);
    if (!deleted) return res.status(404).json({ error: "Reply not found" });

    res.json({ message: "Reply deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createReply,
  getAllReplies,
  getRepliesByChat,
  getReplyById,
  getRepliesByUser,
  updateReply,
  deleteReply,
};
