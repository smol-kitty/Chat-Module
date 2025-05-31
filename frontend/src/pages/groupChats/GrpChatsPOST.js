import React, { useState } from "react";

function GrpChatsPOST() {
  const [senderType, setSenderType] = useState(1);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [tagged, setTagged] = useState(""); // JSON string input
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    console.log("Trying to Submit");
    e.preventDefault();

    // Validate tagged JSON (optional)
    let taggedJson = null;
    if (tagged.trim() !== "") {
      try {
        taggedJson = JSON.parse(tagged);
      } catch (err) {
        alert("Tagged field must be valid JSON");
        return;
      }
    }

    const formData = new FormData();
    formData.append("sender_type", senderType);
    formData.append("sender_id", senderId);
    formData.append("receiver_id", receiverId);
    formData.append("message", message);
    if (taggedJson) {
      formData.append("tagged", JSON.stringify(taggedJson));
    }
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    // Debug: log all form data entries
    console.log("Sending fetch request with FormData:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    try {
      const response = await fetch("http://localhost:4000/api/grp-chats", {
        method: "POST",
        body: formData,
      });
      console.log("Fetch request completed");
      if (!response.ok) {
        console.log("Could not send.");
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      alert("Message sent successfully!");
      // Reset form fields
      setSenderType(1);
      setSenderId("");
      setReceiverId("");
      setMessage("");
      setTagged("");
      setFiles([]);
      console.log("Sent", data);
      console.log("Message sent successfully:", data);
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Post New Group Chat Message</h2>

      <label>
        Sender Type:
        <select
          value={senderType}
          onChange={(e) => setSenderType(Number(e.target.value))}
          required
        >
          <option value={1}>Student</option>
          <option value={2}>Teacher</option>
          <option value={3}>Admin</option>
        </select>
      </label>
      <br />

      <label>
        Sender ID:
        <input
          type="number"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          required
        />
      </label>
      <br />

      <label>
        Receiver (Group) ID:
        <input
          type="number"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          required
        />
      </label>
      <br />

      <label>
        Message:
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={250}
          required
        />
      </label>
      <br />

      <label>
        Tagged (JSON format, optional):
        <textarea
          placeholder='e.g. {"mentionedUsers": [1, 2]}'
          value={tagged}
          onChange={(e) => setTagged(e.target.value)}
        />
      </label>
      <br />

      <label>
        Attach Files:
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
      </label>
      <br />

      <button type="submit">Send Message</button>
    </form>
  );
}

export default GrpChatsPOST;
