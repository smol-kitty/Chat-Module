const db = require("../config/db");

const createAdmin = (data) => {
  const { roll_no, name, role, active } = data;
  return db.query(
    `INSERT INTO administrators (roll_no, name, role, active) VALUES (?, ?, ?, TRUE)`,
    [roll_no, name, role, active]
  );
};

const getAllAdmins = () => {
  return db.query(`SELECT * FROM administrators WHERE active = TRUE`);
};

const updateAdmin = (id, data) => {
  const { roll_no, name, role } = data;
  return db.query(
    `UPDATE administrators SET roll_no = ?, name = ?, role = ? WHERE admin_id = ?`,
    [roll_no, name, role, id]
  );
};

const deactivateAdmin = (id) => {
  return db.query(
    `UPDATE administrators SET active = FALSE WHERE admin_id = ?`,
    [id]
  );
};

module.exports = {
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deactivateAdmin,
};
