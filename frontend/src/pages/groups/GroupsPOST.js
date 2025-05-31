import React, { useState } from "react";
import axios from "axios";

export default function GroupsPOST() {
  const [formData, setFormData] = useState({
    group_name: "",
    creator_type: "",
    created_by: "",
    admin_only: "",
  });
  const [profilePic, setProfilePic] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("group_name", formData.group_name);
    data.append("creator_type", formData.creator_type);
    data.append("created_by", formData.created_by);
    data.append("admin_only", formData.admin_only);
    if (profilePic) {
      data.append("profile_pic", profilePic);
    }

    try {
      await axios.post("http://localhost:4000/api/groups", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("group added!");
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input
        name="group_name"
        placeholder="Group Name"
        onChange={handleChange}
      />
      <input
        name="creator_type"
        placeholder="Creator Type"
        onChange={handleChange}
      />
      <input
        name="created_by"
        placeholder="Created By"
        onChange={handleChange}
      />
      <label>
        Admin Only:
        <input
          type="checkbox"
          name="admin_only"
          checked={formData.admin_only === "true"}
          onChange={(e) =>
            setFormData({
              ...formData,
              admin_only: e.target.checked.toString(),
            })
          }
        />
      </label>
      <input type="file" name="profile_pic" onChange={handleFileChange} />
      <button type="submit">Add group</button>
    </form>
  );
}
