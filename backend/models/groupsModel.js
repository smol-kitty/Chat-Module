const db = require("../config/db");

const getAllGroups = (mode = "present") => {
  let query = "SELECT * FROM groups_list";
  if (mode === "present") query += " WHERE deleted = FALSE";
  else if (mode === "past") query += " WHERE deleted = TRUE";
  return db.query(query);
};

const getGroupById = (id) => {
  return db.query("SELECT * FROM groups_list WHERE group_id = ?", [id]);
};

const getGroupsByCreator = async (
  creator_type,
  created_by,
  mode = "present"
) => {
  let query = `SELECT * FROM groups_list WHERE creator_type = ? AND created_by = ?`;
  if (mode === "present") query += " AND deleted = FALSE";
  else if (mode === "past") query += " AND deleted = TRUE";
  return db.query(query, [creator_type, created_by]);
};

const checkCreatorExists = async (type, id) => {
  let query = "";
  if (type === 1)
    query = "SELECT * FROM students WHERE student_id = ? AND active = TRUE";
  else if (type === 2)
    query = "SELECT * FROM teachers WHERE teacher_id = ? AND active = TRUE";
  else if (type === 3)
    query = "SELECT * FROM administrators WHERE admin_id = ? AND active = TRUE";
  else return false;

  const [rows] = await db.query(query, [id]);
  return rows.length > 0;
};

const generatePhotoId = async () => {
  await db.query(
    "UPDATE photo_counter SET current = LAST_INSERT_ID(current + 1)"
  );
  const [[{ id }]] = await db.query("SELECT LAST_INSERT_ID() as id");
  return id;
};

const createGroup = async (groupData, profile_pic = "default.jpg") => {
  const {
    group_name,
    creator_type: raw_creator_type,
    created_by,
    admin_only = false,
  } = groupData;
  const creator_type = Number(raw_creator_type);
  if (![1, 2, 3].includes(creator_type))
    throw new Error("Invalid creator_type");

  const exists = await checkCreatorExists(creator_type, created_by);
  if (!exists) throw new Error("Creator not found");

  const [groupResult] = await db.query(
    `INSERT INTO groups_list (group_name, creator_type, created_by, admin_only, profile_pic)
     VALUES (?, ?, ?, ?, ?)`,
    [group_name, creator_type, created_by, admin_only, profile_pic]
  );

  const group_id = groupResult.insertId;

  const [[groupRow]] = await db.query(
    `SELECT created_at FROM groups_list WHERE group_id = ?`,
    [group_id]
  );
  const createdAt = groupRow.created_at;

  await db.query(
    `INSERT INTO group_members (member_id, member_type, group_id, admin_status, joined_at)
     VALUES (?, ?, ?, ?, JSON_ARRAY(?))`,
    [created_by, creator_type, group_id, 1, createdAt]
  );

  return group_id;
};

const updateGroup = async (id, updates) => {
  const [existingGroupData] = await db.query(
    "SELECT * FROM groups_list WHERE group_id = ?",
    [id]
  );
  if (existingGroupData.length === 0) throw new Error("Group not found");

  const old = existingGroupData[0];
  const updated = {
    group_name: updates.group_name ?? old.group_name,
    admin_only: updates.admin_only ?? old.admin_only,
    profile_pic: updates.profile_pic ?? old.profile_pic,
  };

  return db.query(
    `UPDATE groups_list SET group_name = ?, admin_only = ?, profile_pic = ? WHERE group_id = ?`,
    [updated.group_name, updated.admin_only, updated.profile_pic, id]
  );
};

const deleteGroup = async (id) => {
  const [updateResult] = await db.query(
    `UPDATE groups_list SET deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE group_id = ?`,
    [id]
  );
  if (updateResult.affectedRows === 0) throw new Error("Group not found");

  const [rows] = await db.query(
    `SELECT deleted_at FROM groups_list WHERE group_id = ?`,
    [id]
  );
  const deletedAt = rows[0]?.deleted_at;
  if (!deletedAt) throw new Error("Deleted_at not found");

  await db.query(
    `UPDATE group_members SET left_at = JSON_ARRAY_APPEND(COALESCE(left_at, JSON_ARRAY()), '$', ?) WHERE group_id = ?`,
    [deletedAt, id]
  );
};

module.exports = {
  getAllGroups,
  getGroupById,
  checkCreatorExists,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupsByCreator,
  generatePhotoId,
};
