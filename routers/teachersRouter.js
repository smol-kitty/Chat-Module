const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teachersControllers");

router.post("/", teacherController.createTeacher);
router.get("/", teacherController.getAllTeachers);
router.put("/:id", teacherController.updateTeacher);
router.delete("/:id", teacherController.deactivateTeacher);

module.exports = router;
