const express = require('express');
const authController = require('../controllers/authController');
const inviteKeyController = require('../controllers/inviteKeyController');
const router = express.Router();

//Only head-admin can access below routes
router.use(authController.protect);
router.use(authController.restrictTo('head-admin'));

router.route('/')
  .get('/', inviteKeyController.getAllInviteKeys)
  .post('/', inviteKeyController.updateInviteKey);

router.route('/:id')
  .get(inviteKeyController.getInviteKey)
  .patch(inviteKeyController.updateInviteKey)
  .delete(inviteKeyController.deleteInviteKey);

module.exports = router