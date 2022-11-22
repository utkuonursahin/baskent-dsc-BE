const express = require('express');
const authController = require('../controllers/authController');
const announcementController = require('../controllers/announcementController');
const router = express.Router();

router.get('/', announcementController.getAllAnnouncements);

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'head-admin'));

router.post('/', announcementController.createAnnouncement);

router.route('/:id')
  .get(announcementController.getAnnouncement)
  .patch(
    announcementController.uploadAnnouncementImages,
    announcementController.resizeAnnouncementImages,
    announcementController.updateAnnouncement)
  .delete(announcementController.deleteAnnouncement);

module.exports = router