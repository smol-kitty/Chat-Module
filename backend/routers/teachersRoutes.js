const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../controllers/teachersControllers");

const upload = multer({ dest: "uploads/" });

router.get("/", controller.getTeachers);
router.get("/teacher/:id", controller.getTeacher);
router.post("/", upload.single("profile_pic"), controller.createTeacher);
router.put(
  "/teacher/:id",
  upload.single("profile_pic"),
  controller.updateTeacher
);
router.delete("/teacher/:id", controller.deleteTeacher);

module.exports = router;
