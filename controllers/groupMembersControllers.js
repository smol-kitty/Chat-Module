const GroupMember = require("../models/groupMembersModel");

const createGroupHandler = async (req, res) => {
  try {
    const result = await GroupModel.createGroup(req.body);
    res
      .status(201)
      .json({ message: "Group created", group_id: result.group_id });
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Utility to safely parse JSON arrays from db fields (which may sometimes be string or already parsed)
function safeParseJsonArray(str) {
  if (Array.isArray(str)) return str;
  if (typeof str === "string") {
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  }
  return [];
}

const createGroupMember = async (req, res) => {
  const { member_id, member_type, group_id } = req.body;

  if (!member_id || !member_type || !group_id)
    return res.status(400).json({ message: "Missing required fields" });

  const [exists] = await GroupMember.checkMemberExists(member_type, member_id);
  if (exists.length === 0)
    return res
      .status(404)
      .json({ message: "No such member found or inactive" });

  const [entry] = await GroupMember.getMemberEntry(
    member_id,
    member_type,
    group_id
  );
  if (entry.length > 0) {
    const row = entry[0];
    const joining = safeParseJsonArray(row.joined_at);
    const leaving = safeParseJsonArray(row.left_at);

    if (joining.length > leaving.length)
      return res.status(400).json({ message: "Member already in group" });

    // Member rejoining, update left_at accordingly
    joining.push(new Date());
    await GroupMember.softDeleteGroupMember(
      member_id,
      group_id,
      leaving,
      member_type
    );
    return res.status(200).json({ message: "Rejoined group" });
  }

  await GroupMember.createGroupMember({
    member_id,
    member_type,
    group_id,
    admin_status: false,
    joined_at: [new Date()],
    left_at: [],
  });

  res.status(201).json({ message: "Group member added", member_id });
};

const updateGroupMember = async (req, res) => {
  const { member_type, member_id, group_id } = req.params;
  const { admin_status } = req.body;

  const [entry] = await GroupMember.getMemberEntry(
    member_id,
    member_type,
    group_id
  );
  if (entry.length === 0)
    return res.status(404).json({ message: "Member not found in group" });

  await GroupMember.updateAdminStatus(
    member_id,
    group_id,
    admin_status ?? entry[0].admin_status,
    member_type
  );
  res.json({ message: "Admin status updated" });
};

const deleteGroupMember = async (req, res) => {
  const { member_type, member_id, group_id } = req.params;

  const [entry] = await GroupMember.getMemberEntry(
    member_id,
    member_type,
    group_id
  );
  if (entry.length === 0)
    return res.status(404).json({ message: "Member not found" });

  const joining = safeParseJsonArray(entry[0].joined_at);
  const leaving = safeParseJsonArray(entry[0].left_at);

  if (joining.length === leaving.length)
    return res
      .status(400)
      .json({ message: "Member is not currently in group" });

  leaving.push(new Date());
  await GroupMember.softDeleteGroupMember(
    member_id,
    group_id,
    leaving,
    member_type
  );

  // Check if after removal only 1 member remains in group, make them admin if not already
  const [members] = await GroupMember.getGroupMembers(group_id, "present");
  if (members.length === 1) {
    const soleMember = members[0];
    if (!soleMember.admin_status) {
      await GroupMember.updateAdminStatus(
        soleMember.member_id,
        group_id,
        true,
        soleMember.member_type
      );
    }
  }

  res.json({ message: "Member removed from group" });
};

const getAllMembers = async (req, res) => {
  const mode = req.query.mode || "present";
  const [rows] = await GroupMember.getAll();

  const filtered = rows.filter((r) => {
    const joined = safeParseJsonArray(r.joined_at);
    const left = safeParseJsonArray(r.left_at);

    if (mode === "present") return joined.length > left.length;
    if (mode === "past") return joined.length === left.length;
    return true; // all mode
  });

  res.json(filtered);
};

const getGroupMembers = async (req, res) => {
  const { group_id } = req.params;
  const mode = req.query.mode || "present";
  const [rows] = await GroupMember.getGroupMembers(group_id, mode);
  res.json(rows);
};

const getUserGroups = async (req, res) => {
  const { member_type, member_id } = req.params;
  const mode = req.query.mode || "present";
  const [rows] = await GroupMember.getUserGroups(member_id, member_type, mode);
  res.json(rows);
};

module.exports = {
  createGroupMember,
  updateGroupMember,
  deleteGroupMember,
  getAllMembers,
  getGroupMembers,
  getUserGroups,
};
