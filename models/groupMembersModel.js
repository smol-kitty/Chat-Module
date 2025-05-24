const db = require("../config/db");

const checkMemberExists = async (type, id) => {
  let table = "",
    column = "";
  switch (type) {
    case 1:
      table = "students";
      column = "student_id";
      break;
    case 2:
      table = "teachers";
      column = "teacher_id";
      break;
    case 3:
      table = "administrators";
      column = "admin_id";
      break;
    default:
      return [[]];
  }
  return db.query(
    `SELECT * FROM ${table} WHERE ${column} = ? AND active = TRUE`,
    [id]
  );
};

const getMemberEntry = (member_id, member_type, group_id) => {
  const where =
    `member_id = ? AND group_id = ?` +
    (member_type !== null ? ` AND member_type = ?` : ``);
  const params =
    member_type !== null
      ? [member_id, group_id, member_type]
      : [member_id, group_id];
  return db.query(`SELECT * FROM group_members WHERE ${where}`, params);
};

const createGroupMember = ({
  member_id,
  member_type,
  group_id,
  admin_status,
  joined_at,
  left_at,
}) => {
  return db.query(
    `INSERT INTO group_members (member_id, member_type, group_id, admin_status, joined_at, left_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      member_id,
      member_type,
      group_id,
      admin_status,
      JSON.stringify(joined_at),
      JSON.stringify(left_at),
    ]
  );
};

const updateAdminStatus = (member_id, group_id, admin_status, member_type) => {
  let sql = `UPDATE group_members SET admin_status = ? WHERE member_id = ? AND group_id = ?`;
  const params = [admin_status, member_id, group_id];
  if (member_type !== undefined) {
    sql += ` AND member_type = ?`;
    params.push(member_type);
  }
  return db.query(sql, params);
};

const softDeleteGroupMember = (member_id, group_id, left_at, member_type) => {
  let sql = `UPDATE group_members SET left_at = ? WHERE member_id = ? AND group_id = ?`;
  const params = [JSON.stringify(left_at), member_id, group_id];
  if (member_type !== undefined) {
    sql += ` AND member_type = ?`;
    params.push(member_type);
  }
  return db.query(sql, params);
};

const getGroupMembers = (group_id, mode = "present") => {
  const condition =
    mode === "past"
      ? "JSON_LENGTH(joined_at) = JSON_LENGTH(left_at)"
      : mode === "all"
      ? "1"
      : "JSON_LENGTH(joined_at) > JSON_LENGTH(left_at)";
  return db.query(
    `SELECT * FROM group_members WHERE group_id = ? AND ${condition}`,
    [group_id]
  );
};

const getUserGroups = (member_id, member_type, mode = "present") => {
  const condition =
    mode === "past"
      ? "JSON_LENGTH(joined_at) = JSON_LENGTH(left_at)"
      : mode === "all"
      ? "1"
      : "JSON_LENGTH(joined_at) > JSON_LENGTH(left_at)";
  return db.query(
    `SELECT * FROM group_members WHERE member_id = ? AND member_type = ? AND ${condition}`,
    [member_id, member_type]
  );
};

const getAll = () => db.query(`SELECT * FROM group_members`);

module.exports = {
  checkMemberExists,
  getMemberEntry,
  createGroupMember,
  updateAdminStatus,
  softDeleteGroupMember,
  getGroupMembers,
  getUserGroups,
  getAll,
};
