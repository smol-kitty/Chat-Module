// models/studentsModel.js
const db = require("../config/db");

const getAllStudents = (mode = "present") => {
  let query = "SELECT * FROM students";
  if (mode === "present") query += " WHERE active = TRUE";
  else if (mode === "past") query += " WHERE active = FALSE";
  return db.query(query);
};

const getStudentById = (id) => {
  const query = "SELECT * FROM students WHERE student_id = ?";
  return db.query(query, [id]);
};

const createStudent = (student) => {
  const {
    roll_no,
    name,
    semester,
    degree,
    active = true,
    profile_pic = "default.jpg",
  } = student;

  const query = `
    INSERT INTO students (roll_no, name, semester, degree, active, profile_pic)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  return db.query(query, [
    roll_no,
    name,
    semester,
    degree,
    active,
    profile_pic,
  ]);
};

const insertPhotoId = () => {
  // Just insert an empty row, return auto-increment ID
  const query = "INSERT INTO photo_counter () VALUES ()";
  return db.query(query);
};

const updateStudent = async (id, updatedFields) => {
  const [rows] = await db.query("SELECT * FROM students WHERE student_id = ?", [
    id,
  ]);
  if (rows.length === 0) throw new Error("Student not found");

  const existing = rows[0];
  const updated = {
    roll_no: updatedFields.roll_no ?? existing.roll_no,
    name: updatedFields.name ?? existing.name,
    semester: updatedFields.semester ?? existing.semester,
    degree: updatedFields.degree ?? existing.degree,
    profile_pic: updatedFields.profile_pic ?? existing.profile_pic,
  };

  const query = `
    UPDATE students
    SET roll_no = ?, name = ?, semester = ?, degree = ?, profile_pic = ?
    WHERE student_id = ?
  `;

  return db.query(query, [
    updated.roll_no,
    updated.name,
    updated.semester,
    updated.degree,
    updated.profile_pic,
    id,
  ]);
};

const updateStudentProfilePic = (id, profilePicFileName) => {
  const query = `UPDATE students SET profile_pic = ? WHERE student_id = ?`;
  return db.query(query, [profilePicFileName, id]);
};

const deleteStudent = (id) => {
  return db.query("UPDATE students SET active = FALSE WHERE student_id = ?", [
    id,
  ]);
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  insertPhotoId,
  updateStudent,
  updateStudentProfilePic,
  deleteStudent,
};
