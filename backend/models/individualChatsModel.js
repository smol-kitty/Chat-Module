const db = require("../config/db");

const model = {
  // ✅ Get all chats by mode
  getAllChats: async (mode = "present") => {
    let clause = "";
    if (mode === "present") clause = "WHERE deleted = FALSE";
    else if (mode === "past") clause = "WHERE deleted = TRUE";

    return db.query(`SELECT * FROM individual_chats ${clause}`);
  },

  // ✅ Get all chats of a user (as sender or receiver)
  getChatsByUser: async (member_type, member_id, mode = "present") => {
    let clause = "";
    if (mode === "present") clause = "AND deleted = FALSE";
    else if (mode === "past") clause = "AND deleted = TRUE";

    const query = `
      SELECT * FROM individual_chats 
      WHERE (sender_type = ? AND sender_id = ?)
         OR (receiver_type = ? AND receiver_id = ?)
         ${clause}
      ORDER BY time ASC
    `;
    return db.query(query, [member_type, member_id, member_type, member_id]);
  },

  // ✅ Validate sender/receiver exist & are active
  validateUser: async (type, id) => {
    const tables = [
      { table: "students", idColumn: "student_id" },
      { table: "teachers", idColumn: "teacher_id" },
      { table: "administrators", idColumn: "admin_id" },
    ];

    if (type < 1 || type > tables.length) return false;
    const { table, idColumn } = tables[type - 1];

    const [[user]] = await db.query(
      `SELECT * FROM ${table} WHERE ${idColumn} = ? AND active = TRUE`,
      [id]
    );

    return !!user;
  },

  // ✅ Create chat
  createChat: async (
    sender_type,
    sender_id,
    receiver_type,
    receiver_id,
    message,
    tagged
  ) => {
    const [result] = await db.query(
      `INSERT INTO individual_chats 
       (sender_type, sender_id, receiver_type, receiver_id, message, tagged) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sender_type, sender_id, receiver_type, receiver_id, message, tagged]
    );
    return result.insertId;
  },

  // ✅ Get single chat
  getChatById: async (chat_id) => {
    return db.query(`SELECT * FROM individual_chats WHERE chat_id = ?`, [
      chat_id,
    ]);
  },

  
  // ✅ Update chat
  updateChat: async (chat_id, message, tagged) => {
    const [result] = await db.query(
      `UPDATE individual_chats SET message = ?, tagged = ? WHERE chat_id = ?`,
      [message, tagged, chat_id]
    );
    return result.affectedRows > 0;
  },

  // ✅ Soft delete
  deleteChat: async (chat_id) => {
    const [result] = await db.query(
      `UPDATE individual_chats SET deleted = TRUE, deleted_time = CURRENT_TIMESTAMP WHERE chat_id = ?`,
      [chat_id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = model;
