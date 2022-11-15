const express = require('express');
const authController = require('../controllers/authController');
const activityController = require('../controllers/activityController');
const router = express.Router();

router.get('/', activityController.getAllActivities);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post('/', activityController.createActivity);

router.route('/:id')
  .get(activityController.getActivity)
  .patch(
    activityController.uploadActivityImages,
    activityController.resizeActivityImages,
    activityController.updateActivity)
  .delete(activityController.deleteActivity);

module.exports = router