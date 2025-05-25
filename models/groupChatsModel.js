const db = require("../config/db");

const groupChatsModel = {
  getAllChats: async (mode = "present") => {
    let condition = "";
    if (mode === "past") {
      condition = "WHERE deleted = TRUE";
    } else if (mode === "present") {
      condition = "WHERE deleted = FALSE";
    }

    const query = `
      SELECT * FROM group_chats
      ${condition}
    `;
    return db.query(query);
  },

  getChatsByGroup: async (group_id, mode = "present") => {
    let condition = "";
    if (mode === "past") {
      condition = "AND deleted = TRUE";
    } else if (mode === "present") {
      condition = "AND deleted = FALSE";
    }

    const query = `
      SELECT * FROM group_chats
      WHERE receiver_id = ?
      ${condition}
    `;
    return db.query(query, [group_id]);
  },

  getChatsByUser: async (sender_type, sender_id, mode = "present") => {
    let deletedClause = "";
    if (mode === "present") deletedClause = "AND gc.deleted = FALSE";
    else if (mode === "past") deletedClause = "AND gc.deleted = TRUE";

    // Step 1: Get list of groups where user is currently a member
    const [groups] = await db.query(
      `
    SELECT group_id FROM group_members
    WHERE member_type = ? AND member_id = ?
    AND JSON_LENGTH(joined_at) > COALESCE(JSON_LENGTH(left_at), 0)
  `,
      [sender_type, sender_id]
    );

    const groupIds = groups.map((row) => row.group_id);
    if (groupIds.length === 0) return [[]]; // user is in no group currently

    const placeholders = groupIds.map(() => "?").join(",");

    // Step 2: Fetch chats from only those groups
    const query = `
    SELECT gc.* FROM group_chats gc
    WHERE gc.receiver_id IN (${placeholders})
    ${deletedClause}
    ORDER BY gc.time ASC
  `;

    return db.query(query, groupIds);
  },

  getChatById: async (chat_id) => {
    const [rows] = await db.query(
      `SELECT * FROM group_chats WHERE chat_id = ?`,
      [chat_id]
    );
    return rows[0];
  },

  getChatById: async (chat_id) => {
    const query = `SELECT * FROM group_chats WHERE chat_id = ?`;
    return db.query(query, [chat_id]);
  },

  createChat: async (sender_type, sender_id, receiver_id, message, tagged) => {
    const [result] = await db.query(
      `INSERT INTO group_chats (sender_type, sender_id, receiver_id, message, tagged)
       VALUES (?, ?, ?, ?, ?)`,
      [sender_type, sender_id, receiver_id, message, JSON.stringify(tagged)]
    );
    return result.insertId;
  },

  updateMessage: async (chat_id, message) => {
    const [result] = await db.query(
      `UPDATE group_chats SET message = ? WHERE chat_id = ?`,
      [message, chat_id]
    );
    return result.affectedRows > 0;
  },

  deleteChat: async (chat_id, time) => {
    const [result] = await db.query(
      `UPDATE group_chats SET deleted = TRUE, deleted_time = ? WHERE chat_id = ?`,
      [time, chat_id]
    );
    return result.affectedRows > 0;
  },

  validateSender: async (sender_type, sender_id) => {
    const tables = ["students", "teachers", "administrators"];
    const table = tables[sender_type - 1];
    const idColumn = table.slice(0, -1) + "_id";

    const [[user]] = await db.query(
      `SELECT * FROM ${table} WHERE ${idColumn} = ? AND active = TRUE`,
      [sender_id]
    );
    return !!user;
  },

  validateGroupExists: async (group_id) => {
    const [[group]] = await db.query(
      `SELECT * FROM groups_list WHERE group_id = ?`,
      [group_id]
    );
    return !!group;
  },
  validateTaggedUsers: async (receiver_id, tagged = []) => {
    if (!Array.isArray(tagged)) return false;

    for (const user of tagged) {
      const member_type = Number(user.member_type);
      const member_id = Number(user.member_id);

      if (Number.isNaN(member_type) || Number.isNaN(member_id)) {
        return false; // Invalid format
      }

      const [[row]] = await db.query(
        `SELECT joined_at, left_at FROM group_members 
       WHERE group_id = ? AND member_type = ? AND member_id = ?`,
        [receiver_id, member_type, member_id]
      );

      if (!row) {
        return false;
      }

      let joined = [];
      let left = [];
      try {
        joined =
          typeof row.joined_at === "string"
            ? JSON.parse(row.joined_at)
            : row.joined_at || [];
        left =
          typeof row.left_at === "string"
            ? JSON.parse(row.left_at)
            : row.left_at || [];

        console.log("Parsed:", joined, left);
      } catch (err) {
        console.log("JSON parse error:", err.message);
        return false;
      }

      if (joined.length <= left.length) return false;
    }

    return true;
  },
};

module.exports = groupChatsModel;
