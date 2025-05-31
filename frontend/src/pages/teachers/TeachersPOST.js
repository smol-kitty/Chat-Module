import React, { useState } from "react";
import axios from "axios";

export default function TeachersPOST() {
  const [formData, setFormData] = useState({
    roll_no: "",
    name: "",
    department: "",
    specialization: "",
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
    data.append("roll_no", formData.roll_no);
    data.append("name", formData.name);
    data.append("specialization", formData.specialization);
    data.append("department", formData.department);
    if (profilePic) {
      data.append("profile_pic", profilePic);
    }

    try {
      await axios.post("http://localhost:4000/api/teachers", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("teacher added!");
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input name="roll_no" placeholder="Roll No" onChange={handleChange} />
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input
        name="department"
        placeholder="Department"
        onChange={handleChange}
      />
      <input
        name="specialization"
        placeholder="Specialization"
        onChange={handleChange}
      />
      <input type="file" name="profile_pic" onChange={handleFileChange} />
      <button type="submit">Add teacher</button>
    </form>
  );
}
