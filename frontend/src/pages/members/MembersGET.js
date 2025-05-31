import React, { useState, useEffect } from "react";
import axios from "axios";

function MembersGET() {
  const [members, setMembers] = useState([]);
  const [mode, setMode] = useState("present");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/members?mode=${mode}`)
      .then((res) => setMembers(res.data))
      .catch((err) => console.error("Error fetching group members:", err));
  }, [mode]);

  function handleModeChange(event) {
    setMode(event.target.value);
  }

  return React.createElement(
    "div",
    null,
    React.createElement("h2", null, "All Group Members"),
    React.createElement(
      "label",
      null,
      "Mode: ",
      React.createElement(
        "select",
        { value: mode, onChange: handleModeChange },
        React.createElement("option", { value: "present" }, "Present"),
        React.createElement("option", { value: "past" }, "Past"),
        React.createElement("option", { value: "all" }, "All")
      )
    ),
    React.createElement(
      "table",
      {
        border: "1",
        cellPadding: "8",
        style: { marginTop: "10px", width: "100%" },
      },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          [
            "Member ID",
            "Member Type",
            "Group ID",
            "Admin Status",
            "Joined At",
            "Left At",
          ].map((heading) =>
            React.createElement("th", { key: heading }, heading)
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        members.map((m, i) =>
          React.createElement(
            "tr",
            { key: i },
            React.createElement("td", null, m.member_id),
            React.createElement("td", null, m.member_type),
            React.createElement("td", null, m.group_id),
            React.createElement("td", null, m.admin_status),
            React.createElement("td", null, JSON.stringify(m.joined_at)),
            React.createElement("td", null, JSON.stringify(m.left_at))
          )
        )
      )
    )
  );
}

export default MembersGET;
