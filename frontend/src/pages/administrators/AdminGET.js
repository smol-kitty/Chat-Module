import React, { useState } from "react";
import axios from "axios";

export default function AdminGET() {
  const [adminId, setadminId] = useState("");
  const [admin, setadmin] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:4000/api/admins/admin/${adminId}`
      );
      setadmin(res.data);
    } catch (err) {
      console.error("admin not found", err);
      setadmin(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter admin ID"
          value={adminId}
          onChange={(e) => setadminId(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {admin && (
        <div>
          <h3>admin Details:</h3>
          <p>
            <strong>ID:</strong> {admin.admin_id}
          </p>
          <p>
            <strong>Roll No:</strong> {admin.roll_no}
          </p>
          <p>
            <strong>Name:</strong> {admin.name}
          </p>
          <p>
            <strong>Role:</strong> {admin.role}
          </p>
          <img
            src={`http://localhost:4000/profiles/${admin.profile_pic}`}
            alt="profile-pic"
            style={{ width: 100, height: 100 }}
          />
        </div>
      )}
    </div>
  );
}
