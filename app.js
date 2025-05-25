require("dotenv").config();
const express = require("express");
const app = express();

const studentsRoutes = require("./routers/studentsRoutes");
const teachersRoutes = require("./routers/teachersRoutes");
const adminsRoutes = require("./routers/adminRoutes");
const groupsRoutes = require("./routers/groupsRoutes");
const groupMembersRoutes = require("./routers/groupMembersRoutes");
const groupChatsRoutes = require("./routers/groupChatsRoutes");
const groupRepliesRoutes = require("./routers/groupRepliesRoutes");

app.use(express.json());

app.use("/api/students", studentsRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/members", groupMembersRoutes);
app.use("/api/grp-chats", groupChatsRoutes);
app.use("/api/grp-replies", groupRepliesRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
