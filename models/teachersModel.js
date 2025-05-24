const db = require("../config/db");

const createTeacher = (data) => {
  const { roll_no, name, department, specialization, active } = data;
  return db.query(
    `INSERT INTO teachers (roll_no, name, department, specialization, active) VALUES (?, ?, ?, ?, TRUE)`,
    [roll_no, name, department, specialization, active]
  );
};

const getAllTeachers = () => {
  return db.query(`SELECT * FROM teachers WHERE active = TRUE`);
};

const updateTeacher = (id, data) => {
  const { roll_no, name, department, specialization } = data;
  return db.query(
    `UPDATE teachers SET roll_no = ?, name = ?, department = ?, specialization = ? WHERE teacher_id = ?`,
    [roll_no, name, department, specialization, id]
  );
};

const deactivateTeacher = (id) => {
  return db.query(`UPDATE teachers SET active = FALSE WHERE teacher_id = ?`, [
    id,
  ]);
};

module.exports = {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deactivateTeacher,
};
