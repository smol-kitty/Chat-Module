import React, { useState } from "react";
import axios from "axios";

function GroupDelete() {
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!groupId) {
      setError("Please enter a group ID");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:4000/api/groups/group/${groupId}`
      );
      setMessage(res.data.message || "Group deleted successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete group");
    }
  };

  return React.createElement(
    "div",
    null,
    React.createElement("h2", null, "Delete Group"),
    error && React.createElement("p", { style: { color: "red" } }, error),
    message && React.createElement("p", { style: { color: "green" } }, message),
    React.createElement(
      "form",
      { onSubmit: handleDelete },
      React.createElement("label", null, "Group ID: "),
      React.createElement("input", {
        type: "number",
        value: groupId,
        onChange: (e) => setGroupId(e.target.value),
      }),
      React.createElement(
        "button",
        { type: "submit", style: { marginLeft: "10px" } },
        "Delete"
      )
    )
  );
}

export default GroupDelete;
