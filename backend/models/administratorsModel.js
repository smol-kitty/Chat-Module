const db = require("../config/db");

const getAllAdmins = (mode = "present") => {
  let query = "SELECT * FROM administrators";
  if (mode === "present") query += " WHERE active = TRUE";
  else if (mode === "past") query += " WHERE active = FALSE";
  return db.query(query);
};

const getAdminById = (id) => {
  return db.query("SELECT * FROM administrators WHERE admin_id = ?", [id]);
};

const createAdmin = ({ roll_no, name, role, profile_pic = null }) => {
  return db.query(
    `INSERT INTO administrators (roll_no, name, role, profile_pic) VALUES (?, ?, ?, ?)`,
    [roll_no, name, role, profile_pic]
  );
};

const updateAdmin = async (id, updatedFields) => {
  const [rows] = await db.query(
    "SELECT * FROM administrators WHERE admin_id = ?",
    [id]
  );
  if (rows.length === 0) throw new Error("Admin not found");

  const existing = rows[0];
  const updated = {
    roll_no: updatedFields.roll_no ?? existing.roll_no,
    name: updatedFields.name ?? existing.name,
    role: updatedFields.role ?? existing.role,
    profile_pic: updatedFields.profile_pic ?? existing.profile_pic,
    active: existing.active,
  };

  return db.query(
    `UPDATE administrators SET roll_no = ?, name = ?, role = ?, profile_pic = ? WHERE admin_id = ?`,
    [updated.roll_no, updated.name, updated.role, updated.profile_pic, id]
  );
};

const deleteAdmin = (id) => {
  return db.query(
    "UPDATE administrators SET active = FALSE WHERE admin_id = ?",
    [id]
  );
};

const removeProfilePic = (id) => {
  return db.query(
    "UPDATE administrators SET profile_pic = NULL WHERE admin_id = ?",
    [id]
  );
};

const generatePhotoId = async () => {
  const [result] = await db.query("INSERT INTO photo_counter () VALUES ()");
  return result.insertId;
};

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  removeProfilePic,
  generatePhotoId,
};
