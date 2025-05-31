import React, { useState } from "react";
import axios from "axios";

function MembersUserGET() {
  const [memberType, setMemberType] = useState("");
  const [memberId, setMemberId] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setGroups([]);

    if (!memberType || !memberId) {
      setError("Please provide member type and member ID");
      return;
    }

    axios
      .get(`http://localhost:4000/api/members/user/${memberType}/${memberId}`, {
        params: { mode: "present" }, // default mode present
      })
      .then((res) => {
        setGroups(res.data || []);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Error fetching groups");
      });
  }

  return React.createElement(
    "div",
    null,
    React.createElement("h2", null, "Get Groups by Member"),
    error && React.createElement("p", { style: { color: "red" } }, error),
    React.createElement(
      "form",
      { onSubmit: handleSubmit },
      React.createElement(
        "div",
        null,
        React.createElement("label", null, "Member Type: "),
        React.createElement(
          "select",
          {
            value: memberType,
            onChange: (e) => setMemberType(e.target.value),
          },
          React.createElement(
            "option",
            { value: "" },
            "-- Select Member Type --"
          ),
          React.createElement("option", { value: "1" }, "Student"),
          React.createElement("option", { value: "2" }, "Teacher"),
          React.createElement("option", { value: "3" }, "Administrator")
        )
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", null, "Member ID: "),
        React.createElement("input", {
          type: "number",
          value: memberId,
          onChange: (e) => setMemberId(e.target.value),
        })
      ),
      React.createElement(
        "button",
        { type: "submit", style: { marginTop: "10px" } },
        "Get Groups"
      )
    ),
    React.createElement(
      "div",
      { style: { marginTop: "20px" } },
      groups.length === 0
        ? React.createElement("p", null, "No groups found")
        : React.createElement(
            "table",
            { border: 1, cellPadding: 5 },
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement("th", null, "Member Type"),
                React.createElement("th", null, "Member ID"),
                React.createElement("th", null, "Group ID"),
                React.createElement("th", null, "Admin Status"),
                React.createElement("th", null, "Joined At"),
                React.createElement("th", null, "Left At")
              )
            ),
            React.createElement(
              "tbody",
              null,
              groups.map((g, i) =>
                React.createElement(
                  "tr",
                  { key: i },
                  React.createElement("td", null, g.member_type),
                  React.createElement("td", null, g.member_id),
                  React.createElement("td", null, g.group_id),
                  React.createElement("td", null, g.admin_status),
                  React.createElement("td", null, JSON.stringify(g.joined_at)),
                  React.createElement("td", null, JSON.stringify(g.left_at))
                )
              )
            )
          )
    )
  );
}

export default MembersUserGET;
