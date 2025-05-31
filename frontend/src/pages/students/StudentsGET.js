import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentsGET() {
  const [students, setStudents] = useState([]);
  const [pastStudents, setPastStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/students")
      .then((response) => {
        console.log(response.data);
        setStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/students?mode=past")
      .then((response) => {
        console.log(response.data);
        setPastStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/students?mode=all")
      .then((response) => {
        console.log(response.data);
        setAllStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <section>
      <div>
        <p>
          <b>Present Students</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Semester</th>
              <th>Degree</th>
              <th>Profile Photo</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.roll_no}</td>
                <td>{student.name}</td>
                <td>{student.semester}</td>
                <td>{student.degree}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${student.profile_pic}`}
                    alt="profile-pic"
                    style={{ width: 50, height: 50 }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p>
          <b>Past Students</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Semester</th>
              <th>Degree</th>
            </tr>
          </thead>
          <tbody>
            {pastStudents.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.roll_no}</td>
                <td>{student.name}</td>
                <td>{student.semester}</td>
                <td>{student.degree}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${student.profile_pic}`}
                    alt="profile-pic"
                    style={{ width: 50, height: 50 }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p>
          <b>All Students</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Semester</th>
              <th>Degree</th>
            </tr>
          </thead>
          <tbody>
            {allStudents.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_id}</td>
                <td>{student.roll_no}</td>
                <td>{student.name}</td>
                <td>{student.semester}</td>
                <td>{student.degree}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${student.profile_pic}`}
                    alt="profile-pic"
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
