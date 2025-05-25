const db = require("../config/db");

const model = {
  getAllReplies: async (mode) => {
    const where =
      mode === "all"
        ? ""
        : mode === "past"
        ? "WHERE deleted = TRUE"
        : "WHERE deleted = FALSE";
    const [rows] = await db.query(`SELECT * FROM individual_replies ${where}`);
    return rows;
  },

  getRepliesByChat: async (chat_id, mode) => {
    const where =
      mode === "all"
        ? ""
        : mode === "past"
        ? "AND deleted = TRUE"
        : "AND deleted = FALSE";
    const [rows] = await db.query(
      `SELECT * FROM individual_replies WHERE parent_id = ? ${where}`,
      [chat_id]
    );
    return rows;
  },

  getReplyById: async (reply_id) => {
    const [rows] = await db.query(
      `SELECT * FROM individual_replies WHERE reply_id = ?`,
      [reply_id]
    );
    return rows;
  },

  getRepliesByUser: async (sender_type, sender_id, mode) => {
    const where =
      mode === "all"
        ? ""
        : mode === "past"
        ? "AND r.deleted = TRUE"
        : "AND r.deleted = FALSE";
    const [rows] = await db.query(
      `SELECT r.* FROM individual_replies r
       JOIN individual_chats c ON r.parent_id = c.chat_id
       WHERE (c.sender_type = ? AND c.sender_id = ?) OR (c.receiver_type = ? AND c.receiver_id = ?)
       ${where}
       ORDER BY r.time ASC`,
      [sender_type, sender_id, sender_type, sender_id]
    );
    return rows;
  },

  createReply: async (sender_type, sender_id, parent_id, message, tagged) => {
    const [result] = await db.query(
      `INSERT INTO individual_replies (sender_type, sender_id, parent_id, message, tagged)
       VALUES (?, ?, ?, ?, ?)`,
      [sender_type, sender_id, parent_id, message, tagged]
    );
    return result.insertId;
  },

  updateReply: async (reply_id, message, tagged) => {
    const [result] = await db.query(
      `UPDATE individual_replies SET message = ?, tagged = ? WHERE reply_id = ?`,
      [message, tagged, reply_id]
    );
    return result.affectedRows > 0;
  },

  deleteReply: async (reply_id) => {
    const [result] = await db.query(
      `UPDATE individual_replies SET deleted = TRUE, deleted_time = CURRENT_TIMESTAMP WHERE reply_id = ?`,
      [reply_id]
    );
    return result.affectedRows > 0;
  },

  validateSender: async (type, id) => {
    const tables = [
      { table: "students", col: "student_id" },
      { table: "teachers", col: "teacher_id" },
      { table: "administrators", col: "admin_id" },
    ];
    if (type < 1 || type > tables.length) return false;
    const { table, col } = tables[type - 1];
    const [[row]] = await db.query(
      `SELECT * FROM ${table} WHERE ${col} = ? AND active = TRUE`,
      [id]
    );
    return !!row;
  },

  validateParentChat: async (chat_id, sender_type, sender_id) => {
    const [[row]] = await db.query(
      `SELECT * FROM individual_chats WHERE chat_id = ? AND deleted = FALSE
       AND (sender_type = ? AND sender_id = ? OR receiver_type = ? AND receiver_id = ?)`,
      [chat_id, sender_type, sender_id, sender_type, sender_id]
    );
    return !!row;
  },
};

module.exports = model;
