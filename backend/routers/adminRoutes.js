const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/administratorsControllers");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "profile-pic"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // temp name
  },
});
const upload = multer({ storage });

router.get("/", controller.getAdmins);
router.get("/admin/:id", controller.getAdmin);
router.post("/", upload.single("profile_pic"), controller.createAdmin);
router.put("/admin/:id", upload.single("profile_pic"), controller.updateAdmin);
router.delete("/admin/:id", controller.deleteAdmin);
router.delete("/admin/:id/profile-pic", controller.removeProfilePic);

module.exports = router;
