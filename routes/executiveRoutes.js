const express = require('express');
const authController = require('../controllers/authController');
const executiveController = require('../controllers/executiveController');
const router = express.Router();

router.get('/', executiveController.getAllExecutives)

//Only head-admin can access below routes
router.use(authController.protect);
router.use(authController.restrictTo('head-admin'));

router.post('/', executiveController.createExecutive);

router.route('/:id')
  .get(executiveController.getExecutive)
  .patch(
    executiveController.uploadExecutiveImage,
    executiveController.resizeExecutiveImage,
    executiveController.updateExecutive)
  .delete(executiveController.deleteExecutive);

module.exports = router