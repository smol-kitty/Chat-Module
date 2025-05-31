const path = require("path");
const fs = require("fs");
const model = require("../models/groupsModel");

const getGroups = async (req, res) => {
  try {
    const mode = req.query.mode || "present";
    const [rows] = await model.getAllGroups(mode);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await model.getGroupById(id);
    if (rows.length === 0)
      return res.status(404).json({ error: "Group not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroupsByCreator = async (req, res) => {
  try {
    const creator_type = parseInt(req.params.creator_type);
    const created_by = parseInt(req.params.created_by);
    const mode = req.query.mode || "present";

    if (![1, 2, 3].includes(creator_type)) {
      return res
        .status(400)
        .json({ error: "Invalid creator_type. Must be 1, 2, or 3" });
    }
    if (!["present", "past", "all"].includes(mode)) {
      return res
        .status(400)
        .json({ error: "Invalid mode. Must be 'present', 'past', or 'all'" });
    }

    const [rows] = await model.getGroupsByCreator(
      creator_type,
      created_by,
      mode
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createGroup = async (req, res) => {
  try {
    const { group_name, creator_type, created_by, admin_only } = req.body;
    let profile_pic = "default.jpg";

    if (req.file) {
      // File already saved by multer, just use its filename
      profile_pic = req.file.filename;

      const oldPath = req.file.path;
      const newPath = path.join(
        __dirname,
        "..",
        "uploads",
        "profile-pic",
        profile_pic
      );

      // Ensure file is in the correct folder
      if (oldPath !== newPath) fs.renameSync(oldPath, newPath);
    }

    const groupId = await model.createGroup(
      {
        group_name,
        creator_type: Number(creator_type),
        created_by,
        admin_only: admin_only === "true",
      },
      profile_pic
    );

    res.status(201).json({ message: "Group created", group_id: groupId });
  } catch (err) {
    console.error("Error in createGroup:", err);
    res.status(400).json({ error: err.message });
  }
};

const updateGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = {
      group_name: req.body.group_name,
      admin_only: req.body.admin_only === "true" ? true : false,
    };

    // Handle delete_pic flag: reset to default.jpg
    if (req.body.delete_pic === "true") {
      updates.profile_pic = "default.jpg";
    }

    // Handle new profile pic upload
    if (req.file) {
      const filename = req.file.filename;
      const oldPath = req.file.path;
      const newPath = path.join(
        __dirname,
        "..",
        "uploads",
        "profile-pic",
        filename
      );

      // Ensure file is moved to the correct folder
      if (oldPath !== newPath) fs.renameSync(oldPath, newPath);

      updates.profile_pic = filename;
    }

    await model.updateGroup(id, updates);
    res.json({ message: "Group updated" });
  } catch (err) {
    console.error("Error in updateGroup:", err);
    res.status(500).json({ error: err.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const id = req.params.id;
    await model.deleteGroup(id);
    res.json({ message: "Group marked as deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupsByCreator,
};
