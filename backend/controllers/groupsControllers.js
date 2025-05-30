const path = require("path");
const fs = require("fs");
const model = require("../models/groupsModel");

const getGroups = async (req, res) => {
  try {
    const mode = req.query.mode || "present";
    const [rows] = await model.getAllGroups(mode);
    res.json(rows); // ✅ direct array response
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
    res.json(rows);
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

    res.json(rows); // ✅ direct array response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createGroup = async (req, res) => {
  try {
    const { group_name, creator_type, created_by, admin_only } = req.body;
    let profile_pic = "default.jpg";

    if (req.file) {
      const photoId = await model.generatePhotoId();
      const ext = path.extname(req.file.originalname) || ".jpg";
      const filename = `${photoId}${ext}`;
      const filePath = path.join(
        __dirname,
        "..",
        "upload",
        "profile-pic",
        filename
      );
      fs.renameSync(req.file.path, filePath);
      profile_pic = filename;
    }

    const groupId = await model.createGroup(
      {
        group_name,
        creator_type: Number(creator_type),
        created_by,
        admin_only: admin_only ?? false,
      },
      profile_pic
    );

    res.status(201).json({ message: "Group created", group_id: groupId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateGroup = async (req, res) => {
  try {
    const id = req.params.id;

    let profile_pic;
    if (req.file) {
      const photoId = await model.generatePhotoId(); // same function used in createGroup
      const filename = `${photoId}.jpg`;
      const filePath = path.join(
        __dirname,
        "..",
        "upload",
        "profile-pic",
        filename
      );
      fs.renameSync(req.file.path, filePath);
      profile_pic = filename;
    }

    const updates = {
      ...req.body,
    };

    if (profile_pic) {
      updates.profile_pic = profile_pic;
    }

    await model.updateGroup(id, updates);
    res.json({ message: "Group updated" });
  } catch (err) {
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
