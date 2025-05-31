import React, { useState } from "react";
import axios from "axios";

export default function GroupPUT() {
  const [groupId, setgroupId] = useState("");
  const [formData, setFormData] = useState({
    group_name: "",
    admin_only: "",
    profile_pic: "default.jpg",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [found, setFound] = useState(false);
  const [deletePic, setDeletePic] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:4000/api/groups/group/${groupId}`
      );
      setFormData(res.data);
      setFound(true);
      setDeletePic(false);
    } catch (err) {
      alert("group not found");
      setFound(false);
      setFormData({
        group_name: "",
        admin_only: "",
        profile_pic: "default.jpg",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleDeletePicChange = (e) => {
    setDeletePic(e.target.checked);
    if (e.target.checked) {
      setProfilePic(null); // prevent uploading new image if delete is selected
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("group_name", formData.group_name);
    form.append("admin_only", formData.admin_only);
    if (profilePic) {
      form.append("profile_pic", profilePic);
    }

    if (deletePic) {
      form.append("delete_pic", "true");
    }

    try {
      await axios.put(
        `http://localhost:4000/api/groups/group/${groupId}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("group updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div>
      <h2>Update group</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter group ID"
          value={groupId}
          onChange={(e) => setgroupId(e.target.value)}
        />
        <button type="submit">Load group</button>
      </form>
      {found && (
        <form onSubmit={handleUpdate}>
          <label>
            Admin Only:
            <input
              type="checkbox"
              name="admin_only"
              checked={
                formData.admin_only === true || formData.admin_only === 1
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  admin_only: e.target.checked,
                })
              }
            />
          </label>

          <input
            type="text"
            name="group_name"
            placeholder="Group Name"
            value={formData.group_name}
            onChange={handleChange}
          />

          <div>
            <p>Current Profile Image:</p>
            <img
              src={`http://localhost:4000/profiles/${formData.profile_pic}`}
              alt="Current Profile"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <label>
            <input
              type="checkbox"
              checked={deletePic}
              onChange={handleDeletePicChange}
            />
            Delete current profile picture
          </label>

          <br />

          <label>
            Upload new profile picture:{" "}
            <input
              type="file"
              disabled={deletePic}
              onChange={handleFileChange}
            />
          </label>

          <br />

          <button type="submit">Update group</button>
        </form>
      )}
    </div>
  );
}
