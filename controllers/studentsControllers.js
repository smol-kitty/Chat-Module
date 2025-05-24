const Student = require('../models/studentsModel');

// CREATE
const createStudent = async (req, res) => {
  try {
    const student = await Student.createStudent(req.body);
    res.status(201).json({ message: "Student created", id: student.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ
const getStudents = async (req, res) => {
  try {
    const students = await Student.getAllStudents();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateStudent = async (req, res) => {
  const id = req.params.id;
  try {
    await Student.updateStudent(id, req.body);
    res.json({ message: "Student updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (soft)
const deleteStudent = async (req, res) => {
  const id = req.params.id;
  try {
    await Student.deactivateStudent(id);
    res.json({ message: "Student deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
};
