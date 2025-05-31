import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GroupsCreatorsGET() {
  const [groups, setGroups] = useState([]);
  const [creatorType, setCreatorType] = useState(1); // Default to 1
  const [createdBy, setCreatedBy] = useState(1); // Default user ID
  const [mode, setMode] = useState("present");

  const fetchGroups = () => {
    axios
      .get(
        `http://localhost:4000/api/groups/user/${creatorType}/${createdBy}?mode=${mode}`
      )
      .then((response) => {
        console.log(response.data);
        setGroups(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchGroups();
  }, [creatorType, createdBy, mode]);

  return (
    <section>
      <div>
        <h2>Groups by Creator</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Creator Type:
            <select
              value={creatorType}
              onChange={(e) => setCreatorType(Number(e.target.value))}
            >
              <option value={1}>Student</option>
              <option value={2}>Teacher</option>
              <option value={3}>Admin</option>
            </select>
          </label>

          <label style={{ marginLeft: "1rem" }}>
            Created By ID:
            <input
              type="number"
              value={createdBy}
              onChange={(e) => setCreatedBy(Number(e.target.value))}
            />
          </label>

          <label style={{ marginLeft: "1rem" }}>
            Mode:
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="present">Present</option>
              <option value="past">Past</option>
              <option value="all">All</option>
            </select>
          </label>

          <button style={{ marginLeft: "1rem" }} onClick={fetchGroups}>
            Fetch
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Group Name</th>
              <th>Creator Type</th>
              <th>Creator ID</th>
              <th>Created At</th>
              <th>Deleted</th>
              <th>Admin Only</th>
              <th>Profile Photo</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.group_id}>
                <td>{group.group_id}</td>
                <td>{group.group_name}</td>
                <td>{group.creator_type}</td>
                <td>{group.created_by}</td>
                <td>{group.created_at}</td>
                <td>{group.deleted ? "Yes" : "No"}</td>
                <td>{group.admin_only ? "Yes" : "No"}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${group.profile_pic}`}
                    alt="profile"
                    style={{ width: 50, height: 50 }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
