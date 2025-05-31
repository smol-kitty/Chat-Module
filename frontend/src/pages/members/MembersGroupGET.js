import React, { useState } from "react";
import axios from "axios";

function MembersGroupGET() {
  const [groupId, setGroupId] = useState("");
  const [mode, setMode] = useState("present");
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMembers([]);

    if (!groupId) {
      setError("Please enter a Group ID");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:4000/api/members/group/${groupId}`,
        { params: { mode } }
      );
      setMembers(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch group members");
    }
  };

  return React.createElement(
    "div",
    null,
    React.createElement("h2", null, "Get Members by Group ID"),
    error && React.createElement("p", { style: { color: "red" } }, error),
    React.createElement(
      "form",
      { onSubmit: handleSubmit },
      React.createElement(
        "div",
        null,
        React.createElement("label", null, "Group ID: "),
        React.createElement("input", {
          type: "number",
          value: groupId,
          onChange: (e) => setGroupId(e.target.value),
        })
      ),
      React.createElement(
        "div",
        null,
        React.createElement("label", null, "Mode: "),
        React.createElement(
          "select",
          {
            value: mode,
            onChange: (e) => setMode(e.target.value),
          },
          React.createElement("option", { value: "present" }, "Present"),
          React.createElement("option", { value: "past" }, "Past"),
          React.createElement("option", { value: "all" }, "All")
        )
      ),
      React.createElement(
        "button",
        { type: "submit", style: { marginTop: "10px" } },
        "Get Members"
      )
    ),
    React.createElement(
      "div",
      { style: { marginTop: "20px" } },
      members.length === 0
        ? React.createElement("p", null, "No members found")
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
              members.map((m, i) =>
                React.createElement(
                  "tr",
                  { key: i },
                  React.createElement("td", null, m.member_type),
                  React.createElement("td", null, m.member_id),
                  React.createElement("td", null, m.group_id),
                  React.createElement("td", null, m.admin_status),
                  React.createElement("td", null, JSON.stringify(m.joined_at)),
                  React.createElement("td", null, JSON.stringify(m.left_at))
                )
              )
            )
          )
    )
  );
}

export default MembersGroupGET;
