const db = require("../config/db");

const checkCreatorExists = async (type, id) => {
  let table = "";
  let column = "";

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
      console.log("❌ Invalid creator type:", type);
      return [[]]; // Invalid type
  }

  // Debug logging
  console.log(
    `🔍 Checking if creator exists → Table: ${table}, Column: ${column}, ID: ${id}`
  );

  try {
    const [rows] = await db.query(
      `SELECT * FROM ${table} WHERE ${column} = ? AND active = TRUE`,
      [id]
    );
    console.log("✅ Query result:", rows);
    return [rows];
  } catch (err) {
    console.error("❌ Error executing creator check query:", err);
    return [[]];
  }
};

const createGroup = async (data) => {
  const { group_name, deleted, creator_type, created_by, admin_only } = data;

  try {
    const [result] = await db.query(
      `INSERT INTO groups_list (group_name, deleted, creator_type, created_by, admin_only)
       VALUES (?, ?, ?, ?, ?)`,
      [group_name, deleted, creator_type, created_by, admin_only]
    );

    const group_id = result.insertId;

    if (!group_id) {
      throw new Error("Failed to get new group ID");
    }

    const joinDate = JSON.stringify([new Date()]);
    const leftDate = JSON.stringify([]);

    const [insertMemberResult] = await db.query(
      `INSERT INTO group_members 
        (member_id, member_type, group_id, admin_status, joined_at, left_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [created_by, creator_type, group_id, true, joinDate, leftDate]
    );

    if (insertMemberResult.affectedRows === 0) {
      throw new Error("Failed to add creator to group members");
    }

    return { group_id };
  } catch (error) {
    console.error("Error in createGroup:", error);
    throw error;
  }
};

module.exports = { createGroup };

const getAllGroups = () => {
  return db.query(`SELECT * FROM groups_list WHERE deleted = FALSE`);
};

const getAllGroupsIncludingDeleted = () => {
  return db.query(`SELECT * FROM groups_list`);
};

const getGroupById = (id) => {
  return db.query(`SELECT * FROM groups_list WHERE group_id = ?`, [id]);
};

const updateGroup = async (id, group_name, admin_only) => {
  return db.query(
    `UPDATE groups_list SET group_name = ?, admin_only = ? WHERE group_id = ? AND deleted = FALSE`,
    [group_name, admin_only, id]
  );
};

const softDeleteGroup = async (id) => {
  return db.query(
    `UPDATE groups_list SET deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE group_id = ?`,
    [id]
  );
};

module.exports = {
  checkCreatorExists,
  createGroup,
  getAllGroups,
  getAllGroupsIncludingDeleted,
  getGroupById,
  updateGroup,
  softDeleteGroup,
};
