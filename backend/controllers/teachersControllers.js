const path = require("path");
const fs = require("fs");
const model = require("../models/teachersModel");

const getTeachers = async (req, res) => {
  try {
    const mode = req.query.mode || "present";
    const [rows] = await model.getAllTeachers(mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await model.getTeacherById(id);
    if (rows.length === 0)
      return res.status(404).json({ error: "Teacher not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTeacher = async (req, res) => {
  try {
    const teacherData = { ...req.body };
    delete teacherData.profile_pic; // ignore if sent as JSON

    const [result] = await model.createTeacher(teacherData);
    const teacherId = result.insertId;

    let profilePicFileName = "default.jpg";

    if (req.file) {
      const [photoResult] = await model.insertPhotoId();
      const photoId = photoResult.insertId;

      profilePicFileName = `${photoId}.jpeg`;

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

    await model.updateTeacherProfilePic(teacherId, profilePicFileName);

    res
      .status(201)
      .json({ teacher_id: teacherId, profile_pic: profilePicFileName });
  } catch (err) {
    console.error("Create teacher error:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const id = req.params.id;

    // Disallow changing teacher_id and active status
    if ("teacher_id" in req.body) delete req.body.teacher_id;
    if ("active" in req.body) delete req.body.active;

    const [rows] = await model.getTeacherById(id);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    await model.updateTeacher(id, req.body);

    if (req.file) {
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

      await model.updateTeacherProfilePic(id, newFileName);
    }

    res.json({ message: "Teacher updated successfully" });
  } catch (err) {
    console.error("Update teacher error:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    await model.deleteTeacher(id);
    res.json({ message: "Teacher marked as inactive" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
