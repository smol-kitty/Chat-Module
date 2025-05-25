const model = require("../models/groupMembersModel");

const getAllGroupMembers = async (req, res) => {
  try {
    const mode = req.query.mode || "present";
    const [rows] = await model.getAllGroupMembers(mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroupMembersByGroupId = async (req, res) => {
  try {
    const group_id = parseInt(req.params.group_id);
    const mode = req.query.mode || "present";
    const [rows] = await model.getGroupMembersByGroupId(group_id, mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroupsByMember = async (req, res) => {
  try {
    const member_type = parseInt(req.params.member_type);
    const member_id = parseInt(req.params.member_id);
    const mode = req.query.mode || "present";

    const [rows] = await model.getGroupsByMember(member_type, member_id, mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addGroupMember = async (req, res) => {
  try {
    const { member_type, member_id, group_id } = req.body;
    await model.addGroupMember(
      Number(member_type),
      Number(member_id),
      Number(group_id)
    );
    res.status(201).json({ message: "Member added to group" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateAdminStatus = async (req, res) => {
  try {
    const { member_type, member_id, group_id } = req.params;
    const { admin_status } = req.body;
    await model.updateAdminStatus(
      Number(member_type),
      Number(member_id),
      Number(group_id),
      Number(admin_status)
    );
    res.json({ message: "Admin status updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeGroupMember = async (req, res) => {
  try {
    const { member_type, member_id, group_id } = req.params;
    await model.removeGroupMember(
      Number(member_type),
      Number(member_id),
      Number(group_id)
    );
    res.json({ message: "Member removed from group" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllGroupMembers,
  getGroupMembersByGroupId,
  getGroupsByMember,
  addGroupMember,
  updateAdminStatus,
  removeGroupMember,
};
