import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminsGET() {
  const [admins, setadmins] = useState([]);
  const [pastadmins, setPastadmins] = useState([]);
  const [alladmins, setAlladmins] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/admins")
      .then((response) => {
        console.log(response.data);
        setadmins(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/admins?mode=past")
      .then((response) => {
        console.log(response.data);
        setPastadmins(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/admins?mode=all")
      .then((response) => {
        console.log(response.data);
        setAlladmins(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <section>
      <div>
        <p>
          <b>Present admins</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>admin ID</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Role</th>
              <th>Profile Photo</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.admin_id}>
                <td>{admin.admin_id}</td>
                <td>{admin.roll_no}</td>
                <td>{admin.name}</td>
                <td>{admin.role}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${admin.profile_pic}`}
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
          <b>Past admins</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>admin ID</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Role</th>
              <th>Profile Photo</th>
            </tr>
          </thead>
          <tbody>
            {pastadmins.map((admin) => (
              <tr key={admin.admin_id}>
                <td>{admin.admin_id}</td>
                <td>{admin.roll_no}</td>
                <td>{admin.name}</td>
                <td>{admin.role}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${admin.profile_pic}`}
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
          <b>All admins</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>Admin ID</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Role</th>
              <th>Profile Photo</th>
            </tr>
          </thead>
          <tbody>
            {alladmins.map((admin) => (
              <tr key={admin.admin_id}>
                <td>{admin.admin_id}</td>
                <td>{admin.roll_no}</td>
                <td>{admin.name}</td>
                <td>{admin.role}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${admin.profile_pic}`}
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
