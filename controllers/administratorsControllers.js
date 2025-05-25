const model = require("../models/administratorsModel");

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
    const [result] = await model.createAdmin(req.body);
    res.status(201).json({ admin_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    await model.updateAdmin(id, req.body);
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

module.exports = {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
