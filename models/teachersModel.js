const db = require("../config/db");

const getAllTeachers = (mode = "present") => {
  let query = "SELECT * FROM teachers";
  if (mode === "present") query += " WHERE active = TRUE";
  else if (mode === "past") query += " WHERE active = FALSE";
  return db.query(query);
};

const getTeacherById = (id) => {
  const query = "SELECT * FROM teachers WHERE teacher_id = ?";
  return db.query(query, [id]); // always returns regardless of active status
};

const createTeacher = (teacher) => {
  const { roll_no, name, department, specialization, active = true } = teacher;

  const query = `
    INSERT INTO teachers (roll_no, name, department, specialization, active)
    VALUES (?, ?, ?, ?, ?)
  `;

  return db.query(query, [roll_no, name, department, specialization, active]);
};

const updateTeacher = async (id, updatedFields) => {
  const [rows] = await db.query("SELECT * FROM teachers WHERE teacher_id = ?", [
    id,
  ]);
  if (rows.length === 0) throw new Error("Teacher not found");

  const existing = rows[0];
  const updated = {
    name: updatedFields.name ?? existing.name,
    roll_no: updatedFields.roll_no ?? existing.roll_no,
    department: updatedFields.department ?? existing.department,
    specialization: updatedFields.specialization ?? existing.specialization,
    active: updatedFields.active ?? existing.active,
  };

  const query = `
    UPDATE teachers
    SET name = ?, roll_no = ?, department = ?, specialization = ?, active = ?
    WHERE teacher_id = ?
  `;
  return db.query(query, [
    updated.name,
    updated.roll_no,
    updated.department,
    updated.specialization,
    updated.active,
    id,
  ]);
};

const deleteTeacher = (id) => {
  return db.query("UPDATE teachers SET active = FALSE WHERE teacher_id = ?", [
    id,
  ]);
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
