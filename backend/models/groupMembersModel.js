const db = require("../config/db");

const getAllGroupMembers = async (mode = "present") => {
  let condition = "";

  if (mode === "present") {
    condition = "JSON_LENGTH(joined_at) > COALESCE(JSON_LENGTH(left_at), 0)";
  } else if (mode === "past") {
    condition = "JSON_LENGTH(joined_at) = COALESCE(JSON_LENGTH(left_at), 0)";
  }

  const query = `
    SELECT * FROM group_members
    ${condition ? "WHERE " + condition : ""}
  `;
  return db.query(query);
};

const getGroupMembersByGroupId = async (group_id, mode = "present") => {
  let condition = "";
  if (mode === "present") {
    condition =
      "AND JSON_LENGTH(joined_at) > COALESCE(JSON_LENGTH(left_at), 0)";
  } else if (mode === "past") {
    condition =
      "AND JSON_LENGTH(joined_at) = COALESCE(JSON_LENGTH(left_at), 0)";
  }

  const query = `
    SELECT * FROM group_members
    WHERE group_id = ?
    ${condition}
  `;
  return db.query(query, [group_id]);
};

const getGroupsByMember = async (member_type, member_id, mode = "present") => {
  let condition = "";
  if (mode === "present") {
    condition =
      "AND JSON_LENGTH(joined_at) > COALESCE(JSON_LENGTH(left_at), 0)";
  } else if (mode === "past") {
    condition =
      "AND JSON_LENGTH(joined_at) = COALESCE(JSON_LENGTH(left_at), 0)";
  }

  const query = `
    SELECT * FROM group_members
    WHERE member_type = ? AND member_id = ?
    ${condition}
  `;
  return db.query(query, [member_type, member_id]);
};

const checkMemberAndGroupExist = async (member_type, member_id, group_id) => {
  let table;
  if (member_type === 1) table = "students";
  else if (member_type === 2) table = "teachers";
  else if (member_type === 3) table = "administrators";
  else return false;

  const [[member]] = await db.query(
    `SELECT * FROM ${table} WHERE ${table.slice(
      0,
      -1
    )}_id = ? AND active = TRUE`,
    [member_id]
  );
  if (!member) return false;

  const [[group]] = await db.query(
    `SELECT * FROM groups_list WHERE group_id = ? AND deleted = FALSE`,
    [group_id]
  );
  return !!group;
};

const addGroupMember = async (member_type, member_id, group_id) => {
  const exists = await checkMemberAndGroupExist(
    member_type,
    member_id,
    group_id
  );
  if (!exists)
    throw new Error("Member or group does not exist or is inactive/deleted");

  const [[row]] = await db.query(
    `SELECT * FROM group_members WHERE member_type = ? AND member_id = ? AND group_id = ?`,
    [member_type, member_id, group_id]
  );

  const now = new Date();

  if (!row) {
    await db.query(
      `INSERT INTO group_members (member_type, member_id, group_id, admin_status, joined_at)
       VALUES (?, ?, ?, 0, JSON_ARRAY(?))`,
      [member_type, member_id, group_id, now]
    );
  } else {
    const joinedCount = row.joined_at?.length || 0;
    const leftCount = row.left_at?.length || 0;

    if (joinedCount > leftCount)
      throw new Error("Member is already in the group");

    await db.query(
      `UPDATE group_members
       SET joined_at = JSON_ARRAY_APPEND(joined_at, '$', ?)
       WHERE member_type = ? AND member_id = ? AND group_id = ?`,
      [now, member_type, member_id, group_id]
    );
  }
};

const updateAdminStatus = async (
  member_type,
  member_id,
  group_id,
  admin_status
) => {
  const [result] = await db.query(
    `UPDATE group_members
     SET admin_status = ?
     WHERE member_type = ? AND member_id = ? AND group_id = ?`,
    [admin_status, member_type, member_id, group_id]
  );
  return result.affectedRows > 0;
};

const removeGroupMember = async (member_type, member_id, group_id) => {
  const [[row]] = await db.query(
    `SELECT joined_at, left_at FROM group_members WHERE member_type = ? AND member_id = ? AND group_id = ?`,
    [member_type, member_id, group_id]
  );

  if (!row) throw new Error("Member not found");

  const joined = row.joined_at || [];
  const left = row.left_at || [];

  if (joined.length <= left.length) {
    throw new Error("Member is not currently in the group or already left");
  }

  const now = new Date();
  await db.query(
    `UPDATE group_members
     SET left_at = JSON_ARRAY_APPEND(COALESCE(left_at, JSON_ARRAY()), '$', ?)
     WHERE member_type = ? AND member_id = ? AND group_id = ?`,
    [now, member_type, member_id, group_id]
  );
};

module.exports = {
  getAllGroupMembers,
  getGroupMembersByGroupId,
  getGroupsByMember,
  addGroupMember,
  updateAdminStatus,
  removeGroupMember,
};
