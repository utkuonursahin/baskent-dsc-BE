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
    //Delete old image from the file system
    executiveController.deleteExecutiveImage,
    executiveController.resizeExecutiveImage,
    executiveController.updateExecutive)
  .delete(
    executiveController.deleteExecutiveImage,
    executiveController.deleteExecutive);

module.exports = router