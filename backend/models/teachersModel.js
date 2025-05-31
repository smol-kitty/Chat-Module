const db = require("../config/db");

const getAllTeachers = (mode = "present") => {
  let query = "SELECT * FROM teachers";
  if (mode === "present") query += " WHERE active = TRUE";
  else if (mode === "past") query += " WHERE active = FALSE";
  return db.query(query);
};

const getTeacherById = (id) => {
  const query = "SELECT * FROM teachers WHERE teacher_id = ?";
  return db.query(query, [id]);
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
    roll_no: updatedFields.roll_no ?? existing.roll_no,
    name: updatedFields.name ?? existing.name,
    department: updatedFields.department ?? existing.department,
    specialization: updatedFields.specialization ?? existing.specialization,
    profile_pic: updatedFields.profile_pic ?? existing.profile_pic,
    active: existing.active, // keep existing active status
  };

  const query = `
    UPDATE teachers
    SET roll_no = ?, name = ?, department = ?, specialization = ?, profile_pic = ?
    WHERE teacher_id = ?
  `;
  return db.query(query, [
    updated.roll_no,
    updated.name,
    updated.department,
    updated.specialization,
    updated.profile_pic,
    id,
  ]);
};

const deleteTeacher = (id) => {
  return db.query("UPDATE teachers SET active = FALSE WHERE teacher_id = ?", [
    id,
  ]);
};

const insertPhotoId = () => {
  // Dummy table photo_counter stores auto-increment for image naming
  const query = "INSERT INTO photo_counter () VALUES ()";
  return db.query(query);
};

const updateTeacherProfilePic = (id, fileName) => {
  const query = "UPDATE teachers SET profile_pic = ? WHERE teacher_id = ?";
  return db.query(query, [fileName, id]);
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  insertPhotoId,
  updateTeacherProfilePic,
};
