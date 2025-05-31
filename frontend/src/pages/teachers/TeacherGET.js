import React, { useState } from "react";
import axios from "axios";

export default function TeacherGET() {
  const [teacherId, setteacherId] = useState("");
  const [teacher, setteacher] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:4000/api/teachers/teacher/${teacherId}`
      );
      setteacher(res.data);
    } catch (err) {
      console.error("teacher not found", err);
      setteacher(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter teacher ID"
          value={teacherId}
          onChange={(e) => setteacherId(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {teacher && (
        <div>
          <h3>Teacher Details:</h3>
          <p>
            <strong>ID:</strong> {teacher.teacher_id}
          </p>
          <p>
            <strong>Roll No:</strong> {teacher.roll_no}
          </p>
          <p>
            <strong>Name:</strong> {teacher.name}
          </p>
          <p>
            <strong>Department:</strong> {teacher.department}
          </p>
          <p>
            <strong>Specialization:</strong> {teacher.specialization}
          </p>
          <img
            src={`http://localhost:4000/profiles/${teacher.profile_pic}`}
            alt="profile-pic"
            style={{ width: 100, height: 100 }}
          />
        </div>
      )}
    </div>
  );
}
