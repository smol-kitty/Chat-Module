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

    // Prevent modification of protected fields
    delete req.body.teacher_id;
    delete req.body.active;

    // Fetch current teacher data
    const [rows] = await model.getTeacherById(id);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const existingTeacher = rows[0];
    let finalProfilePic = existingTeacher.profile_pic;

    const profilePicsDir = path.join(__dirname, "..", "uploads", "profile-pic");
    if (!fs.existsSync(profilePicsDir)) {
      fs.mkdirSync(profilePicsDir, { recursive: true });
    }

    // Handle delete profile picture
    const shouldDeletePic = req.body.delete_pic === "true";
    if (shouldDeletePic && finalProfilePic !== "default.jpg") {
      // Do not delete the file from disk, just reset DB field
      finalProfilePic = "default.jpg";
    }

    // Handle new profile picture upload
    if (req.file) {
      // If uploading a new picture and the old one exists and is not default, delete it
      if (finalProfilePic !== "default.jpg" && !shouldDeletePic) {
        const oldPicPath = path.join(profilePicsDir, finalProfilePic);
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      }

      // Generate a new unique name
      const [photoResult] = await model.insertPhotoId();
      const photoId = photoResult.insertId;
      const newFileName = `${photoId}.jpeg`;

      const destPath = path.join(profilePicsDir, newFileName);
      fs.renameSync(req.file.path, destPath);

      finalProfilePic = newFileName;
    }

    // Assign final profile picture to the update body
    req.body.profile_pic = finalProfilePic;

    // Remove `delete_pic` so it doesn't interfere with DB update
    delete req.body.delete_pic;

    // Perform the DB update
    await model.updateTeacher(id, req.body);

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
