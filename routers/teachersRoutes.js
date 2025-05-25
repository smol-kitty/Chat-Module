const express = require("express");
const router = express.Router();
const controller = require("../controllers/teachersControllers");

router.get("/", controller.getTeachers);
router.get("/teacher/:id", controller.getTeacher);
router.post("/", controller.createTeacher);
router.put("/teacher/:id", controller.updateTeacher);
router.delete("/teacher/:id", controller.deleteTeacher);

module.exports = router;
