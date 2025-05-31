import React, { useState } from "react";
import axios from "axios";

export default function StudentGET() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `http://localhost:4000/api/students/student/${studentId}`
      );
      setStudent(res.data);
    } catch (err) {
      console.error("Student not found", err);
      setStudent(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {student && (
        <div>
          <h3>Student Details:</h3>
          <p>
            <strong>ID:</strong> {student.student_id}
          </p>
          <p>
            <strong>Roll No:</strong> {student.roll_no}
          </p>
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <strong>Semester:</strong> {student.semester}
          </p>
          <p>
            <strong>Degree:</strong> {student.degree}
          </p>
          <img
            src={`http://localhost:4000/profiles/${student.profile_pic}`}
            alt="profile-pic"
            style={{ width: 100, height: 100 }}
          />
        </div>
      )}
    </div>
  );
}
