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
    const [result] = await model.createTeacher(req.body);
    res.status(201).json({ teacher_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    await model.updateTeacher(id, req.body);
    res.json({ message: "Teacher updated successfully" });
  } catch (err) {
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
