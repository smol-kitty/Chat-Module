const model = require("../models/groupRepliesModel");

// ➕ Create a reply
const createReply = async (req, res) => {
  try {
    const { sender_type, sender_id, receiver_id, parent_id, message, tagged } =
      req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const validSender = await model.validateSender(sender_type, sender_id);
    const validGroup = await model.validateGroupExists(receiver_id);
    const validParent = await model.validateParentChat(parent_id, receiver_id);
    const inGroup = await model.validateMembership(
      receiver_id,
      sender_type,
      sender_id
    );
    const validTagged = await model.validateTaggedUsers(
      receiver_id,
      tagged || []
    );
    if (
      !validSender ||
      !validGroup ||
      !validParent ||
      !inGroup ||
      !validTagged
    ) {
      return res
        .status(400)
        .json({ error: "Invalid sender, group, parent chat, or tagged users" });
    }

    const reply_id = await model.createReply(
      sender_type,
      sender_id,
      receiver_id,
      parent_id,
      message,
      tagged || []
    );

    return res.status(201).json({ message: "Reply sent", reply_id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 📄 Get all replies (mode: present | past)
const getAllReplies = async (req, res) => {
  const mode = req.query.mode || "present";
  const [rows] = await model.getAllReplies(mode);
  res.json(rows);
};

// 📄 Get replies by group
const getRepliesByGroup = async (req, res) => {
  const { group_id } = req.params;
  const mode = req.query.mode || "present";
  const [rows] = await model.getRepliesByGroup(group_id, mode);
  res.json(rows);
};

// 📄 Get replies by user in groups
const getRepliesByUser = async (req, res) => {
  const { sender_type, sender_id } = req.params;
  const mode = req.query.mode || "present";
  const [rows] = await model.getRepliesByUser(sender_type, sender_id, mode);
  res.json(rows);
};

// 📄 Get replies by parent chat
const getRepliesByChat = async (req, res) => {
  const { chat_id } = req.params;
  const mode = req.query.mode || "present";
  const [rows] = await model.getRepliesByChat(chat_id, mode);
  res.json(rows);
};

const getByReplyId = async (req, res) => {
  try {
    const reply_id = Number(req.params.reply_id);

    if (isNaN(reply_id)) {
      return res.status(400).json({ error: "Invalid reply_id" });
    }

    const [rows] = await model.getReplyById(reply_id);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Reply not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

    const updated = await model.updateReply(reply_id, message, tagged || []);
    if (!updated) {
      return res.status(404).json({ error: "Reply not found or unchanged" });
    }

    res.json({ message: "Reply updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Soft delete a reply
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
  getRepliesByGroup,
  getRepliesByUser,
  getRepliesByChat,
  getByReplyId,
  updateReply,
  deleteReply,
};
