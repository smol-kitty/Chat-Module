const express = require('express');
const router = express.Router();
const groupMembersController = require('../controllers/groupMembersControllers');

router.get('/', groupMembersController.getAllGroupMembers);
router.get('/group/:group_id', groupMembersController.getGroupMembersByGroupId);
router.get('/user/:member_type/:member_id', groupMembersController.getGroupsByMember);
router.post('/', groupMembersController.addGroupMember);
router.put('/user/:member_type/:member_id/:group_id', groupMembersController.updateAdminStatus);
router.delete('/user/:member_type/:member_id/:group_id', groupMembersController.removeGroupMember);

module.exports = router;
