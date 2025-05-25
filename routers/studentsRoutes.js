const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentsControllers");

router.get("/", controller.getStudents);
router.get("/student/:id", controller.getStudent);
router.post("/", controller.createStudent);
router.put("/student/:id", controller.updateStudent);
router.delete("/student/:id", controller.deleteStudent);

module.exports = router;
