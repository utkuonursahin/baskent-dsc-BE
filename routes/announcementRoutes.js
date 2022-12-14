const express = require('express');
const authController = require('../controllers/authController');
const announcementController = require('../controllers/announcementController');
const router = express.Router();

router.get('/', announcementController.getAllAnnouncements);
router.get('/:id', announcementController.getAnnouncement);

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'head-admin'));

router.post('/', announcementController.createAnnouncement);

router.route('/:id')
  .patch(
    announcementController.uploadAnnouncementImages,
    announcementController.deleteAnnouncementImages,
    announcementController.resizeAnnouncementImages,
    announcementController.updateAnnouncement)
  .delete(
    announcementController.deleteAnnouncementImages,
    announcementController.deleteAnnouncement
  );

module.exports = router