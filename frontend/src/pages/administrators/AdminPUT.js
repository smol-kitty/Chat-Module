import React, { useState } from "react";
import axios from "axios";

export default function AdminPUT() {
  const [adminId, setadminId] = useState("");
  const [formData, setFormData] = useState({
    roll_no: "",
    name: "",
    role: "",
    profile_pic: "default.jpg",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [found, setFound] = useState(false);
  const [deletePic, setDeletePic] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:4000/api/admins/admin/${adminId}`
      );
      setFormData(res.data);
      setFound(true);
      setDeletePic(false);
    } catch (err) {
      alert("admin not found");
      setFound(false);
      setFormData({
        roll_no: "",
        name: "",
        role: "",
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
    form.append("roll_no", formData.roll_no);
    form.append("name", formData.name);
    form.append("role", formData.role);

    if (profilePic) {
      form.append("profile_pic", profilePic);
    }

    if (deletePic) {
      form.append("delete_pic", "true");
    }

    try {
      await axios.put(
        `http://localhost:4000/api/admins/admin/${adminId}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("admin updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div>
      <h2>Update admin</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter admin ID"
          value={adminId}
          onChange={(e) => setadminId(e.target.value)}
        />
        <button type="submit">Load admin</button>
      </form>

      {found && (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="roll_no"
            placeholder="Roll No"
            value={formData.roll_no}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
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
          <button type="submit">Update admin</button>
        </form>
      )}
    </div>
  );
}
