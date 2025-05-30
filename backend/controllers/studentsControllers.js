const path = require("path");
const fs = require("fs");
const model = require("../models/studentsModel");

const getStudents = async (req, res) => {
  try {
    const mode = req.query.mode || "present";
    const [rows] = await model.getAllStudents(mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await model.getStudentById(id);
    if (rows.length === 0)
      return res.status(404).json({ error: "Student not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const studentData = { ...req.body };
    delete studentData.profile_pic; // in case sent in JSON

    const [result] = await model.createStudent(studentData);
    const studentId = result.insertId;

    let profilePicFileName = "default.jpg";

    if (req.file) {
      // Insert a new photo_id for naming
      const [photoResult] = await model.insertPhotoId();
      const photoId = photoResult.insertId;

      profilePicFileName = `${photoId}.jpeg`;

      // Make sure upload folder exists
      const profilePicsDir = path.join(
        __dirname,
        "..",
        "uploads",
        "profile-pic"
      );
      if (!fs.existsSync(profilePicsDir)) {
        fs.mkdirSync(profilePicsDir, { recursive: true });
      }

      const destPath = path.join(profilePicsDir, profilePicFileName);

      fs.renameSync(req.file.path, destPath);
    }

    await model.updateStudentProfilePic(studentId, profilePicFileName);

    res
      .status(201)
      .json({ student_id: studentId, profile_pic: profilePicFileName });
  } catch (err) {
    console.error("Create student error:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;

    // Prevent changing student_id and active status
    delete req.body.student_id;
    delete req.body.active;

    // Check student exists
    const [rows] = await model.getStudentById(id);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Update student data
    await model.updateStudent(id, req.body);

    if (req.file) {
      // Get new photo_id for filename
      const [photoResult] = await model.insertPhotoId();
      const photoId = photoResult.insertId;
      const newFileName = `${photoId}.jpeg`;

      const profilePicsDir = path.join(
        __dirname,
        "..",
        "uploads",
        "profile-pic"
      );
      if (!fs.existsSync(profilePicsDir)) {
        fs.mkdirSync(profilePicsDir, { recursive: true });
      }

      const destPath = path.join(profilePicsDir, newFileName);
      fs.renameSync(req.file.path, destPath);

      await model.updateStudentProfilePic(id, newFileName);
    }

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    await model.deleteStudent(id);
    res.json({ message: "Student marked as inactive" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
