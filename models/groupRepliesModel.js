const db = require("../config/db");

const groupRepliesModel = {
  // 🔍 Get all replies (past or present)
  getAllReplies: async (mode = "present") => {
    let condition =
      mode === "past" ? "WHERE deleted = TRUE" : "WHERE deleted = FALSE";
    return db.query(`SELECT * FROM group_replies ${condition}`);
  },

  // 🔍 Get all replies of a group
  getRepliesByGroup: async (group_id, mode = "present") => {
    let condition =
      mode === "past" ? "AND deleted = TRUE" : "AND deleted = FALSE";
    return db.query(
      `SELECT * FROM group_replies WHERE receiver_id = ? ${condition}`,
      [group_id]
    );
  },

  // 🔍 Get all replies by a user (in all groups where they’re active)
  getRepliesByUser: async (sender_type, sender_id, mode = "present") => {
    const [[groups]] = await db.query(
      `SELECT group_id FROM group_members
       WHERE member_type = ? AND member_id = ?
       AND JSON_LENGTH(joined_at) > COALESCE(JSON_LENGTH(left_at), 0)`,
      [sender_type, sender_id]
    );

    const groupIds = groups.map((g) => g.group_id);
    if (groupIds.length === 0) return [[]];

    const placeholders = groupIds.map(() => "?").join(",");
    const condition =
      mode === "past" ? "AND deleted = TRUE" : "AND deleted = FALSE";

    return db.query(
      `SELECT * FROM group_replies
       WHERE receiver_id IN (${placeholders}) AND sender_type = ? AND sender_id = ?
       ${condition}
       ORDER BY time ASC`,
      [...groupIds, sender_type, sender_id]
    );
  },

  // 🔍 Get all replies for a specific parent chat
  getRepliesByChat: async (chat_id, mode = "present") => {
    const condition =
      mode === "past" ? "AND deleted = TRUE" : "AND deleted = FALSE";
    return db.query(
      `SELECT * FROM group_replies WHERE parent_id = ? ${condition}`,
      [chat_id]
    );
  },

  // ✅ Validate sender
  validateSender: async (sender_type, sender_id) => {
    const tables = [
      { table: "students", idColumn: "student_id" },
      { table: "teachers", idColumn: "teacher_id" },
      { table: "administrators", idColumn: "admin_id" },
    ];

    if (sender_type < 1 || sender_type > tables.length) return false;

    const { table, idColumn } = tables[sender_type - 1];
    const [[user]] = await db.query(
      `SELECT * FROM ${table} WHERE ${idColumn} = ? AND active = TRUE`,
      [sender_id]
    );

    return !!user;
  },

  // ✅ Validate group exists
  validateGroupExists: async (group_id) => {
    const [[group]] = await db.query(
      `SELECT * FROM groups_list WHERE group_id = ?`,
      [group_id]
    );
    return !!group;
  },

  // ✅ Validate chat exists and belongs to group
  validateParentChat: async (parent_id, receiver_id) => {
    const [[chat]] = await db.query(
      `SELECT * FROM group_chats WHERE chat_id = ? AND receiver_id = ?`,
      [parent_id, receiver_id]
    );
    return !!chat;
  },

  // ✅ Check if user is part of group (active)
  validateMembership: async (receiver_id, sender_type, sender_id) => {
    const [[row]] = await db.query(
      `SELECT joined_at, left_at FROM group_members 
       WHERE group_id = ? AND member_type = ? AND member_id = ?`,
      [receiver_id, sender_type, sender_id]
    );

    if (!row) return false;

    try {
      const joined =
        typeof row.joined_at === "string"
          ? JSON.parse(row.joined_at)
          : row.joined_at || [];
      const left =
        typeof row.left_at === "string"
          ? JSON.parse(row.left_at)
          : row.left_at || [];
      return joined.length > left.length;
    } catch {
      return false;
    }
  },

  // ✅ Validate tagged users are part of group
  validateTaggedUsers: async (receiver_id, tagged = []) => {
    if (!Array.isArray(tagged)) return false;

    for (const user of tagged) {
      const member_type = Number(user.member_type);
      const member_id = Number(user.member_id);

      if (Number.isNaN(member_type) || Number.isNaN(member_id)) return false;

      const [[row]] = await db.query(
        `SELECT joined_at, left_at FROM group_members 
         WHERE group_id = ? AND member_type = ? AND member_id = ?`,
        [receiver_id, member_type, member_id]
      );

      if (!row) return false;

      try {
        const joined =
          typeof row.joined_at === "string"
            ? JSON.parse(row.joined_at)
            : row.joined_at || [];
        const left =
          typeof row.left_at === "string"
            ? JSON.parse(row.left_at)
            : row.left_at || [];
        if (joined.length <= left.length) return false;
      } catch {
        return false;
      }
    }

    return true;
  },

  // ➕ Post a new reply
  getRepliesByUser: async (sender_type, sender_id, mode = "present") => {
    let deletedClause = "";
    if (mode === "present") deletedClause = "AND gr.deleted = FALSE";
    else if (mode === "past") deletedClause = "AND gr.deleted = TRUE";

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

    // Create placeholders for IN clause
    const placeholders = groupIds.map(() => "?").join(",");

    // Step 2: Fetch replies for those groups
    const query = `
    SELECT gr.* FROM group_replies gr
    WHERE gr.receiver_id IN (${placeholders})
    ${deletedClause}
    ORDER BY gr.time ASC
  `;

    return db.query(query, groupIds);
  },

  getRepliesByChatId: async (chat_id) => {
    const query = `
    SELECT * FROM group_replies
    WHERE parent_id = ?
    ORDER BY time ASC
  `;

    const [rows] = await db.query(query, [chat_id]);
    return rows;
  },

  // ✏️ Update message and tagged
  updateReply: async (reply_id, message, tagged) => {
    const [result] = await db.query(
      `UPDATE group_replies SET message = ?, tagged = ? WHERE reply_id = ?`,
      [message, JSON.stringify(tagged), reply_id]
    );
    return result.affectedRows > 0;
  },

  // ❌ Soft delete
  deleteReply: async (reply_id) => {
    const [result] = await db.query(
      `UPDATE group_replies SET deleted = TRUE, deleted_time = CURRENT_TIMESTAMP WHERE reply_id = ?`,
      [reply_id]
    );
    return result.affectedRows > 0;
  },

  // 📦 Get a specific reply
  // 📦 Get a specific reply by ID
  getReplyById: async (reply_id) => {
    return db.query(`SELECT * FROM group_replies WHERE reply_id = ?`, [
      reply_id,
    ]);
  },
};

module.exports = groupRepliesModel;
