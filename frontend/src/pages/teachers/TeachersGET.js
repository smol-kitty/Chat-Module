import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TeachersGET() {
  const [teachers, setteachers] = useState([]);
  const [pastteachers, setPastteachers] = useState([]);
  const [allteachers, setAllteachers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/teachers")
      .then((response) => {
        console.log(response.data);
        setteachers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/teachers?mode=past")
      .then((response) => {
        console.log(response.data);
        setPastteachers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/teachers?mode=all")
      .then((response) => {
        console.log(response.data);
        setAllteachers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <section>
      <div>
        <p>
          <b>Present teachers</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Specialization</th>
              <th>Profile Photo</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.teacher_id}>
                <td>{teacher.teacher_id}</td>
                <td>{teacher.roll_no}</td>
                <td>{teacher.name}</td>
                <td>{teacher.department}</td>
                <td>{teacher.specialization}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${teacher.profile_pic}`}
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
          <b>Past teachers</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {pastteachers.map((teacher) => (
              <tr key={teacher.teacher_id}>
                <td>{teacher.teacher_id}</td>
                <td>{teacher.roll_no}</td>
                <td>{teacher.name}</td>
                <td>{teacher.department}</td>
                <td>{teacher.specialization}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${teacher.profile_pic}`}
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
          <b>All teachers</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>Teacher ID</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Specialization</th>
            </tr>
          </thead>
          <tbody>
            {allteachers.map((teacher) => (
              <tr key={teacher.teacher_id}>
                <td>{teacher.teacher_id}</td>
                <td>{teacher.roll_no}</td>
                <td>{teacher.name}</td>
                <td>{teacher.department}</td>
                <td>{teacher.specialization}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${teacher.profile_pic}`}
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
