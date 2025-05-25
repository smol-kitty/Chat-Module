const db = require("../config/db");

const getAllAdmins = (mode = "present") => {
  let query = "SELECT * FROM administrators";
  if (mode === "present") query += " WHERE active = TRUE";
  else if (mode === "past") query += " WHERE active = FALSE";
  return db.query(query);
};

const getAdminById = (id) => {
  const query = "SELECT * FROM administrators WHERE admin_id = ?";
  return db.query(query, [id]); // fetch regardless of active status
};

const createAdmin = (admin) => {
  const { roll_no, name, role, active = true } = admin;
  const query = `
    INSERT INTO administrators (roll_no, name, role, active)
    VALUES (?, ?, ?, ?)
  `;
  return db.query(query, [roll_no, name, role, active]);
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
    active: updatedFields.active ?? existing.active,
  };

  const query = `
    UPDATE administrators
    SET roll_no = ?, name = ?, role = ?, active = ?
    WHERE admin_id = ?
  `;
  return db.query(query, [
    updated.roll_no,
    updated.name,
    updated.role,
    updated.active,
    id,
  ]);
};

const deleteAdmin = (id) => {
  return db.query(
    "UPDATE administrators SET active = FALSE WHERE admin_id = ?",
    [id]
  );
};

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
