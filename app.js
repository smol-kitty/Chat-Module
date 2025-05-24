require("dotenv").config();
const express = require("express");
const app = express();

const studentsRoutes = require("./routers/studentsRouter");
const teachersRoutes = require("./routers/teachersRouter");
const adminRoutes = require("./routers/adminRouter");
const groupsRoutes = require("./routers/groupsRouter");
const groupMemberRoutes = require("./routers/groupMembersRouters");

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/members", groupMemberRoutes);

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
