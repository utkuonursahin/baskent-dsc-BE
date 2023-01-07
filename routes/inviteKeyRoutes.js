const express = require('express');
const authController = require('../controllers/authController');
const inviteKeyController = require('../controllers/inviteKeyController');
const router = express.Router();

//Only head-admin can access below routes
router.use(authController.protect);
router.use(authController.restrictTo('head-admin'));

router.get('/invite', authController.invite)

router.route('/')
  .get(inviteKeyController.getAllInviteKeys)
  .post(inviteKeyController.createInviteKey); //This route is not supported, it is just for reference

router.route('/:id')
  .get(inviteKeyController.getInviteKey)
  .patch(inviteKeyController.updateInviteKey) //This route is not supported, it is just for reference
  .delete(inviteKeyController.deleteInviteKey);

module.exports = router