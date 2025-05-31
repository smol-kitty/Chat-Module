import React, { useState } from "react";
import axios from "axios";

function MembersPOST() {
  const [memberType, setMemberType] = useState("");
  const [memberId, setMemberId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    // Basic validation
    if (!memberType || !memberId || !groupId) {
      setError("Please fill all fields");
      return;
    }

    axios
      .post("http://localhost:4000/api/members", {
        member_type: Number(memberType),
        member_id: Number(memberId),
        group_id: Number(groupId),
      })
      .then((res) => {
        setMessage(res.data.message || "Member added successfully");
        setMemberType("");
        setMemberId("");
        setGroupId("");
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Error adding member");
      });
  }

  return React.createElement(
    "div",
    null,
    React.createElement("h2", null, "Add Group Member"),
    error && React.createElement("p", { style: { color: "red" } }, error),
    message && React.createElement("p", { style: { color: "green" } }, message),
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
        "button",
        { type: "submit", style: { marginTop: "10px" } },
        "Add Member"
      )
    )
  );
}

export default MembersPOST;
