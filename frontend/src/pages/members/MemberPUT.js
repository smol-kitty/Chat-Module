import React, { useState } from "react";
import axios from "axios";

function MemberPUT() {
  const [memberType, setMemberType] = useState("");
  const [memberId, setMemberId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [adminStatus, setAdminStatus] = useState(""); // usually 0 or 1
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!memberType || !memberId || !groupId || adminStatus === "") {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const url = `http://localhost:4000/api/members/user/${memberType}/${memberId}/${groupId}`;
      const payload = { admin_status: Number(adminStatus) };

      const res = await axios.put(url, payload);
      setMessage(res.data.message || "Admin status updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update admin status");
    }
  };

  return (
    <div>
      <h2>Update Admin Status</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Member Type: </label>
          <select
            value={memberType}
            onChange={(e) => setMemberType(e.target.value)}
          >
            <option value="">-- Select Member Type --</option>
            <option value="1">Student</option>
            <option value="2">Teacher</option>
            <option value="3">Administrator</option>
          </select>
        </div>

        <div>
          <label>Member ID: </label>
          <input
            type="number"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </div>

        <div>
          <label>Group ID: </label>
          <input
            type="number"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          />
        </div>

        <div>
          <label>Admin Status: </label>
          <select
            value={adminStatus}
            onChange={(e) => setAdminStatus(e.target.value)}
          >
            <option value="">-- Select Status --</option>
            <option value="0">Not Admin</option>
            <option value="1">Admin</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Update Admin Status
        </button>
      </form>
    </div>
  );
}

export default MemberPUT;
