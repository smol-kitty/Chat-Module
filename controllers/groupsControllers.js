const Group = require("../models/groupsModel");

const createGroup = async (req, res) => {
  try {
    const {
      group_name,
      creator_type,
      created_by,
      admin_only = false,
    } = req.body;

    if (!group_name || !creator_type || !created_by) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [creatorRows] = await Group.checkCreatorExists(
      creator_type,
      created_by
    );

    if (creatorRows.length === 0) {
      return res.status(404).json({ message: "Creator not found or inactive" });
    }

    const [result] = await Group.createGroup({
      group_name,
      deleted: false,
      creator_type,
      created_by,
      admin_only,
    });

    res.status(201).json({
      message: "Group created successfully",
      group_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const [rows] = await Group.getAllGroups();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllGroupsIncludingDeleted = async (req, res) => {
  try {
    const [rows] = await Group.getAllGroupsIncludingDeleted();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroupById = async (req, res) => {
  const groupId = req.params.id;

  try {
    const [rows] = await Group.getGroupById(groupId);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGroup = async (req, res) => {
  const groupId = req.params.id;
  const { group_name, admin_only } = req.body;

  try {
    // Fetch existing group
    const [existingRows] = await Group.getGroupById(groupId);

    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    const existingGroup = existingRows[0];

    // Use existing values if fields are not provided
    const updatedGroupName =
      group_name !== undefined ? group_name : existingGroup.group_name;
    const updatedAdminOnly =
      admin_only !== undefined ? admin_only : existingGroup.admin_only;

    await Group.updateGroup(groupId, updatedGroupName, updatedAdminOnly);

    res.json({ message: "Group updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteGroup = async (req, res) => {
  const groupId = req.params.id;

  try {
    await Group.softDeleteGroup(groupId);
    res.json({ message: "Group marked as deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  getAllGroupsIncludingDeleted,
  getGroupById,
  updateGroup,
  deleteGroup,
};
