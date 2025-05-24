const db = require("../config/db");

// Create
const createStudent = async ({ roll_no, name, semester, degree }) => {
  const [result] = await db.query(
    `INSERT INTO students (roll_no, name, semester, degree, active)
     VALUES (?, ?, ?, ?, TRUE)`,
    [roll_no, name, semester, degree]
  );
  return { id: result.insertId };
};

// Read All
const getAllStudents = async () => {
  const [rows] = await db.query(`SELECT * FROM students WHERE active = TRUE`);
  return rows;
};

// Update
const updateStudent = async (id, updates) => {
  const { roll_no, name, semester, degree } = updates;
  await db.query(
    `UPDATE students SET roll_no = ?, name = ?, semester = ?, degree = ? WHERE student_id = ?`,
    [roll_no, name, semester, degree, id]
  );
};

// Soft Delete
const deactivateStudent = async (id) => {
  await db.query(`UPDATE students SET active = FALSE WHERE student_id = ?`, [
    id,
  ]);
};

module.exports = {
  createStudent,
  getAllStudents,
  updateStudent,
  deactivateStudent,
};
