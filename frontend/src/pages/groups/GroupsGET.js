import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function GroupsGET() {
  const [groups, setgroups] = useState([]);
  const [pastgroups, setPastgroups] = useState([]);
  const [allgroups, setAllgroups] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/groups")
      .then((response) => {
        console.log(response.data);
        setgroups(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/groups?mode=past")
      .then((response) => {
        console.log(response.data);
        setPastgroups(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/groups?mode=all")
      .then((response) => {
        console.log(response.data);
        setAllgroups(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <section>
      <div>
        <p>
          <b>Present groups</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Group Name</th>
              <th>Creator Type</th>
              <th>Creator ID</th>
              <th>Created At</th>
              <th>Deleted</th>
              <th>Admin Only</th>
              <th>Profile Photo</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.group_id}>
                <td>{group.group_id}</td>
                <td>{group.group_name}</td>
                <td>{group.creator_type}</td>
                <td>{group.created_by}</td>
                <td>{group.created_at}</td>
                <td>{group.deleted}</td>
                <td>{group.admin_only}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${group.profile_pic}`}
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
          <b>Past groups</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Group Name</th>
              <th>Creator Type</th>
              <th>Creator ID</th>
              <th>Created At</th>
              <th>Deleted</th>
              <th>Admin Only</th>
              <th>Profile Photo</th>
            </tr>
          </thead>
          <tbody>
            {pastgroups.map((group) => (
              <tr key={group.group_id}>
                <td>{group.group_id}</td>
                <td>{group.group_name}</td>
                <td>{group.creator_type}</td>
                <td>{group.created_by}</td>
                <td>{group.created_at}</td>
                <td>{group.deleted}</td>
                <td>{group.admin_only}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${group.profile_pic}`}
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
          <b>All groups</b>
        </p>
        <table>
          <thead>
            <tr>
              <th>Group ID</th>
              <th>Group Name</th>
              <th>Creator Type</th>
              <th>Creator ID</th>
              <th>Created At</th>
              <th>Deleted</th>
              <th>Admin Only</th>
              <th>Profile Photo</th>
            </tr>
          </thead>
          <tbody>
            {allgroups.map((group) => (
              <tr key={group.group_id}>
                <td>{group.group_id}</td>
                <td>{group.group_name}</td>
                <td>{group.creator_type}</td>
                <td>{group.created_by}</td>
                <td>{group.created_at}</td>
                <td>{group.deleted}</td>
                <td>{group.admin_only}</td>
                <td>
                  <img
                    src={`http://localhost:4000/profiles/${group.profile_pic}`}
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
