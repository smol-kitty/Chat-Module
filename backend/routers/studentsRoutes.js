const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../controllers/studentsControllers");

const upload = multer({ dest: "uploads/" });

router.get("/", controller.getStudents);
router.get("/student/:id", controller.getStudent);
router.post("/", upload.single("profile_pic"), controller.createStudent);
router.put(
  "/student/:id",
  upload.single("profile_pic"),
  controller.updateStudent
);
router.delete("/student/:id", controller.deleteStudent);

module.exports = router;
