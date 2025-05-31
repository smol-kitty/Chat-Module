const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupsControllers");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db");

// Create upload folder if missing
const uploadDir = path.join(__dirname, "..", "uploads", "profile-pic");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: async (req, file, cb) => {
    const [result] = await db.query("INSERT INTO photo_counter () VALUES ()");
    const ext = path.extname(file.originalname);
    cb(null, `${result.insertId}${ext}`);
  },
});

const upload = multer({ storage });

router.get("/", controller.getGroups);
router.get("/user/:creator_type/:created_by", controller.getGroupsByCreator);
router.get("/group/:id", controller.getGroup);
router.post("/", upload.single("profile_pic"), controller.createGroup);
router.put("/group/:id", upload.single("profile_pic"), controller.updateGroup); // multer here!
router.delete("/group/:id", controller.deleteGroup);

module.exports = router;
