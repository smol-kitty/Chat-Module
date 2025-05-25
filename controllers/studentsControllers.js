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
    const [result] = await model.createStudent(req.body);
    res.status(201).json({ student_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    await model.updateStudent(id, req.body);
    res.json({ message: "Student updated successfully" });
  } catch (err) {
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
