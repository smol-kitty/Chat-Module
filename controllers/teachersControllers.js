const Teacher = require("../models/teachersModel");

const createTeacher = async (req, res) => {
  try {
    const [result] = await Teacher.createTeacher(req.body);
    res
      .status(201)
      .json({ message: "Teacher created", teacher_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const [rows] = await Teacher.getAllTeachers();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    await Teacher.updateTeacher(req.params.id, req.body);
    res.json({ message: "Teacher updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deactivateTeacher = async (req, res) => {
  try {
    await Teacher.deactivateTeacher(req.params.id);
    res.json({ message: "Teacher deactivated (soft deleted)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deactivateTeacher,
};
