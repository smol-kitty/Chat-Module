import React, { useState } from "react";
import axios from "axios";

export default function GroupGET() {
  const [groupId, setgroupId] = useState("");
  const [group, setgroup] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:4000/api/groups/group/${groupId}`
      );
      setgroup(res.data);
      console.log(res);
    } catch (err) {
      console.error("group not found", err);
      setgroup(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter group ID"
          value={groupId}
          onChange={(e) => setgroupId(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {group && (
        <div>
          <h3>Group Details:</h3>
          <p>
            <strong>ID:</strong> {group.group_id}
          </p>
          <p>
            <strong>Name:</strong> {group.group_name}
          </p>
          <p>
            <strong>Creator Type:</strong> {group.creator_type}
          </p>
          <p>
            <strong>Creator ID:</strong> {group.created_by}
          </p>
          <p>
            <strong>Created At:</strong> {group.created_at}
          </p>
          <p>
            <strong>Deleted:</strong> {group.deleted}
          </p>
          <img
            src={`http://localhost:4000/profiles/${group.profile_pic}`}
            alt="profile-pic"
            style={{ width: 100, height: 100 }}
          />
        </div>
      )}
    </div>
  );
}
