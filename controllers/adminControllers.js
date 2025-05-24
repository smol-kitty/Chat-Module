const Admin = require('../models/adminModel');

const createAdmin = async (req, res) => {
  try {
    const [result] = await Admin.createAdmin(req.body);
    res.status(201).json({ message: 'Administrator created', admin_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const [rows] = await Admin.getAllAdmins();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    await Admin.updateAdmin(req.params.id, req.body);
    res.json({ message: 'Administrator updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deactivateAdmin = async (req, res) => {
  try {
    await Admin.deactivateAdmin(req.params.id);
    res.json({ message: 'Administrator deactivated (soft deleted)' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deactivateAdmin
};
