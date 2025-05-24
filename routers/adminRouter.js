const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');

router.post('/', adminController.createAdmin);
router.get('/', adminController.getAllAdmins);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deactivateAdmin);

module.exports = router;
