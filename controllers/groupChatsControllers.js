const db = require("./db"); // your mysql2 promise pool or connection

// Helper: Check if user exists and active (sender or tagged)
async function isValidUser(type, id) {
  let table;
  if (type === 1) table = "students";
  else if (type === 2) table = "teachers";
  else if (type === 3) table = "administrators";
  else return false;

  const [rows] = await db.query(
    `SELECT 1 FROM ${table} WHERE ${table.slice(
      0,
      -1
    )}_id = ? AND active = TRUE LIMIT 1`,
    [id]
  );
  return rows.length > 0;
}

// Helper: Check if group exists and not deleted
async function isValidGroup(group_id) {
  const [rows] = await db.query(
    `SELECT 1 FROM groups_list WHERE group_id = ? AND deleted = FALSE LIMIT 1`,
    [group_id]
  );
  return rows.length > 0;
}

// Helper: Check if person (type, id) currently member of group_id
async function isCurrentMember(group_id, person_type, person_id) {
  const [rows] = await db.query(
    `SELECT joined_at, left_at FROM group_members WHERE group_id = ? AND member_type = ? AND member_id = ? LIMIT 1`,
    [group_id, person_type, person_id]
  );
  if (rows.length === 0) return false;

  const joined_at = JSON.parse(rows[0].joined_at);
  let left_at = rows[0].left_at ? JSON.parse(rows[0].left_at) : [];

  return joined_at.length > left_at.length;
}

module.exports = {
  // GET /group_chats?deleted=past|present|all
  async getAll(req, res) {
    try {
      const { deleted } = req.query; // past=deleted true, present=deleted false, all=any

      let condition = "";
      if (deleted === "past") condition = "WHERE deleted = TRUE";
      else if (deleted === "present") condition = "WHERE deleted = FALSE";

      const [rows] = await db.query(
        `SELECT * FROM group_chats ${condition} ORDER BY time DESC`
      );
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // GET /group_chats/group/:group_id
  async getByGroup(req, res) {
    try {
      const { group_id } = req.params;
      // Group exists or not, deleted doesn't matter here
      const [rows] = await db.query(
        `SELECT * FROM group_chats WHERE receiver_id = ? ORDER BY time DESC`,
        [group_id]
      );
      res.json(rows);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // GET /group_chats/user/:sender_type/:sender_id
  async getByUser(req, res) {
    try {
      const { sender_type, sender_id } = req.params;
      // get all groups (past & present) where user was member ever
      const [userGroups] = await db.query(
        `SELECT DISTINCT group_id FROM group_members WHERE member_type = ? AND member_id = ?`,
        [sender_type, sender_id]
      );
      const groupIds = userGroups.map((g) => g.group_id);
      if (groupIds.length === 0) {
        return res.json([]); // no groups no chats
      }
      // get chats where sender is user OR receiver_id in user's groups
      const [chats] = await db.query(
        `SELECT * FROM group_chats WHERE (sender_type = ? AND sender_id = ?) OR receiver_id IN (?) ORDER BY time DESC`,
        [sender_type, sender_id, groupIds]
      );
      res.json(chats);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // POST /group_chats
  async create(req, res) {
    try {
      const { sender_type, sender_id, receiver_id, message, tagged } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: "Message cannot be empty" });
      }

      if (!(await isValidUser(sender_type, sender_id))) {
        return res.status(400).json({ error: "Invalid or inactive sender" });
      }

      if (!(await isValidGroup(receiver_id))) {
        return res
          .status(400)
          .json({ error: "Invalid or deleted receiver group" });
      }

      // tagged must be an array of { person_type, person_id }
      let taggedArr = [];
      try {
        taggedArr = tagged ? JSON.parse(tagged) : [];
        if (!Array.isArray(taggedArr)) throw new Error();
      } catch {
        return res.status(400).json({ error: "Invalid tagged JSON array" });
      }

      // Validate all tagged persons are current members of group
      for (const tag of taggedArr) {
        if (!tag.person_type || !tag.person_id) {
          return res
            .status(400)
            .json({
              error: "Tagged entries must have person_type and person_id",
            });
        }
        const isMember = await isCurrentMember(
          receiver_id,
          tag.person_type,
          tag.person_id
        );
        if (!isMember) {
          return res
            .status(400)
            .json({
              error: `Tagged person ${tag.person_type}-${tag.person_id} is not current member of the group`,
            });
        }
      }

      const [result] = await db.query(
        `INSERT INTO group_chats (sender_type, sender_id, receiver_id, message, tagged) VALUES (?, ?, ?, ?, ?)`,
        [
          sender_type,
          sender_id,
          receiver_id,
          message.trim(),
          JSON.stringify(taggedArr),
        ]
      );

      res.status(201).json({ chat_id: result.insertId });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // PUT /group_chats/:chat_id
  async update(req, res) {
    try {
      const { chat_id } = req.params;
      const { message } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: "Message cannot be empty" });
      }

      // Only update message, keep everything else unchanged
      const [rows] = await db.query(
        `SELECT * FROM group_chats WHERE chat_id = ?`,
        [chat_id]
      );
      if (rows.length === 0)
        return res.status(404).json({ error: "Chat not found" });

      await db.query(`UPDATE group_chats SET message = ? WHERE chat_id = ?`, [
        message.trim(),
        chat_id,
      ]);

      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // DELETE /group_chats/:chat_id
  async remove(req, res) {
    try {
      const { chat_id } = req.params;

      // Set deleted flag and deleted_time
      const [rows] = await db.query(
        `SELECT * FROM group_chats WHERE chat_id = ?`,
        [chat_id]
      );
      if (rows.length === 0)
        return res.status(404).json({ error: "Chat not found" });

      if (rows[0].deleted)
        return res.status(400).json({ error: "Chat already deleted" });

      await db.query(
        `UPDATE group_chats SET deleted = TRUE, deleted_time = NOW() WHERE chat_id = ?`,
        [chat_id]
      );

      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};
