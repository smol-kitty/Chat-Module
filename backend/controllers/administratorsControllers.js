const fs = require("fs");
const path = require("path");
const model = require("../models/administratorsModel");

const PROFILE_PIC_DIR = path.join(__dirname, "..", "uploads", "profile-pic");

const getAdmins = async (req, res) => {
  try {
    const mode = req.query.mode || "present";
    const [rows] = await model.getAllAdmins(mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await model.getAdminById(id);
    if (rows.length === 0)
      return res.status(404).json({ error: "Admin not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    let profile_pic = "default.jpg"; // set default

    if (req.file) {
      const photoId = await model.generatePhotoId();
      const newFileName = `${photoId}.jpeg`;
      const newPath = path.join(PROFILE_PIC_DIR, newFileName);
      fs.renameSync(req.file.path, newPath);
      profile_pic = newFileName;
    }

    const [result] = await model.createAdmin({
      roll_no: req.body.roll_no,
      name: req.body.name,
      role: req.body.role,
      profile_pic,
    });

    res.status(201).json({ admin_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    if ("admin_id" in req.body) delete req.body.admin_id;
    if ("active" in req.body) delete req.body.active;

    const [rows] = await model.getAdminById(id);
    if (rows.length === 0)
      return res.status(404).json({ error: "Admin not found" });

    let profile_pic = rows[0].profile_pic || "default.jpg";

    if (req.body.profile_pic === null) {
      profile_pic = "default.jpg";
    }

    if (req.file) {
      const photoId = await model.generatePhotoId();
      const newFileName = `${photoId}.jpeg`;
      const newPath = path.join(PROFILE_PIC_DIR, newFileName);
      fs.renameSync(req.file.path, newPath);
      profile_pic = newFileName;
    }

    await model.updateAdmin(id, {
      ...req.body,
      profile_pic,
    });

    res.json({ message: "Admin updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    await model.deleteAdmin(id);
    res.json({ message: "Admin marked as inactive" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeProfilePic = async (req, res) => {
  try {
    await model.removeProfilePic(req.params.id);
    res.json({ message: "Profile picture removed from record" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  removeProfilePic,
};
