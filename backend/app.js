require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // adjust if different
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(
  "/profiles",
  express.static(path.join(__dirname, "uploads/profile-pic"))
);

// Routes
app.use("/api/students", require("./routers/studentsRoutes"));
app.use("/api/teachers", require("./routers/teachersRoutes"));
app.use("/api/admins", require("./routers/adminRoutes"));
app.use("/api/groups", require("./routers/groupsRoutes"));
app.use("/api/members", require("./routers/groupMembersRoutes"));
app.use("/api/grp-chats", require("./routers/groupChatsRoutes"))(io); // inject io
app.use("/api/grp-replies", require("./routers/groupRepliesRoutes"));
app.use("/api/individual-chats", require("./routers/individualChatsRoutes"));
app.use(
  "/api/individual-replies",
  require("./routers/individualRepliesRoutes")
);

// Start server
server.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  socket.on("joinGroup", (groupId) => {
    socket.join(`group_${groupId}`);
    console.log(`Client joined group_${groupId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});
