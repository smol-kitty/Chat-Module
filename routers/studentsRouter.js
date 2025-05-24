const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentsControllers");

router.post("/", studentController.createStudent); // Create
router.get("/", studentController.getStudents); // Read
router.put("/:id", studentController.updateStudent); // Update
router.delete("/:id", studentController.deleteStudent); // Soft Delete

module.exports = router;
