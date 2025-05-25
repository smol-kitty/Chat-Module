const express = require("express");
const router = express.Router();
const controller = require("../controllers/administratorsControllers");

router.get("/", controller.getAdmins); 
router.get("/admin/:id", controller.getAdmin);
router.post("/", controller.createAdmin);
router.put("/admin/:id", controller.updateAdmin);
router.delete("/admin/:id", controller.deleteAdmin);

module.exports = router;
