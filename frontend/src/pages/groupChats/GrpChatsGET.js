import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket";

function GrpChatsGET() {
  const [groupId, setGroupId] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!joined) return; // Only run effect after group joined

    socket.emit("joinGroup", groupId);

    axios
      .get("http://localhost:4000/api/grp-chats/group/" + groupId)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error("Error fetching group chats:", err);
      });

    socket.on("receiveMessage", function (msg) {
      if (msg.receiver_id === groupId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Cleanup socket listener on unmount or groupId change
    return () => {
      socket.off("receiveMessage");
    };
  }, [joined, groupId]);

  function handleSubmit(e) {
    e.preventDefault();
    if (groupId.trim()) {
      setJoined(true); // triggers useEffect to join group and fetch messages
    }
  }

  return (
    <div>
      <h2>Group Chat View</h2>
      {!joined && (
        <form onSubmit={handleSubmit}>
          <label>
            Enter Group ID:{" "}
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              required
            />
          </label>
          <button type="submit">Join Group</button>
        </form>
      )}

      {joined && (
        <div>
          <h3>Messages in Group {groupId}:</h3>
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.chat_id}>
                <strong>
                  {msg.sender_type}-{msg.sender_id}:{" "}
                </strong>
                {msg.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default GrpChatsGET;
