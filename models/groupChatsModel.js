const db = require("./db");

async function userExists(senderType, senderId) {
  // Map senderType to table and primary key column manually
  if (senderType === 1) {
    const [rows] = await db.query(
      "SELECT 1 FROM students WHERE student_id = ? AND active = TRUE LIMIT 1",
      [senderId]
    );
    return rows.length > 0;
  } else if (senderType === 2) {
    const [rows] = await db.query(
      "SELECT 1 FROM teachers WHERE teacher_id = ? AND active = TRUE LIMIT 1",
      [senderId]
    );
    return rows.length > 0;
  } else if (senderType === 3) {
    const [rows] = await db.query(
      "SELECT 1 FROM administrators WHERE admin_id = ? AND active = TRUE LIMIT 1",
      [senderId]
    );
    return rows.length > 0;
  }
  return false;
}

async function groupExists(groupId) {
  const [rows] = await db.query(
    "SELECT 1 FROM groups_list WHERE group_id = ? AND deleted = FALSE LIMIT 1",
    [groupId]
  );
  return rows.length > 0;
}

async function isMemberActiveInGroup(memberType, memberId, groupId) {
  const [rows] = await db.query(
    "SELECT joined_at, left_at FROM group_members WHERE member_type = ? AND member_id = ? AND group_id = ?",
    [memberType, memberId, groupId]
  );
  if (rows.length === 0) return false;

  const joined_at = Array.isArray(rows[0].joined_at) ? rows[0].joined_at : [];
  const left_at = Array.isArray(rows[0].left_at) ? rows[0].left_at : [];

  return joined_at.length > left_at.length;
}

async function getAllChats({ deleted = "all", senderId, senderType }) {
  let deletedCondition = "";
  if (deleted === "true") deletedCondition = " AND gc.deleted = TRUE ";
  else if (deleted === "false") deletedCondition = " AND gc.deleted = FALSE ";

  if (senderId && senderType) {
    const [groups] = await db.query(
      "SELECT DISTINCT group_id FROM group_members WHERE member_id = ? AND member_type = ?",
      [senderId, senderType]
    );

    const groupIds = groups.length ? groups.map((g) => g.group_id) : [-1];

    const [rows] = await db.query(
      `SELECT gc.*
      FROM group_chats gc
      WHERE 1=1 ${deletedCondition} AND
      (
        (gc.sender_id = ? AND gc.sender_type = ?)
        OR gc.receiver_id IN (?)
      )
      ORDER BY gc.time DESC`,
      [senderId, senderType, groupIds]
    );

    return rows;
  } else {
    const [rows] = await db.query(
      `SELECT gc.* FROM group_chats gc WHERE 1=1 ${deletedCondition} ORDER BY gc.time DESC`
    );
    return rows;
  }
}

async function createChat({
  sender_type,
  sender_id,
  receiver_id,
  message,
  tagged,
}) {
  const now = new Date();

  const [result] = await db.query(
    `INSERT INTO group_chats 
    (sender_type, sender_id, receiver_id, message, tagged, time, deleted, deleted_time)
    VALUES (?, ?, ?, ?, ?, ?, FALSE, NULL)`,
    [
      sender_type,
      sender_id,
      receiver_id,
      message,
      JSON.stringify(tagged || []),
      now,
    ]
  );
  return result.insertId;
}

async function updateChat(chatId, newMessage) {
  const [rows] = await db.query("SELECT * FROM group_chats WHERE chat_id = ?", [
    chatId,
  ]);
  if (rows.length === 0) throw new Error("Chat not found");

  await db.query("UPDATE group_chats SET message = ? WHERE chat_id = ?", [
    newMessage,
    chatId,
  ]);

  return true;
}

async function deleteChat(chatId) {
  const now = new Date();

  const [rows] = await db.query("SELECT * FROM group_chats WHERE chat_id = ?", [
    chatId,
  ]);
  if (rows.length === 0) throw new Error("Chat not found");

  await db.query(
    "UPDATE group_chats SET deleted = TRUE, deleted_time = ? WHERE chat_id = ?",
    [now, chatId]
  );

  return true;
}

module.exports = {
  userExists,
  groupExists,
  isMemberActiveInGroup,
  getAllChats,
  createChat,
  updateChat,
  deleteChat,
};
