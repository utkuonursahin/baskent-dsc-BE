const express = require('express');
const authController = require('../controllers/authController');
const executiveController = require('../controllers/executiveController');
const router = express.Router();

//Only head-admin can access below routes
router.use(authController.protect);
router.use(authController.restrictTo('head-admin'));

router.route('/')
  .get('/', executiveController.getAllExecutives)
  .post('/', executiveController.updateExecutive);

router.route('/:id')
  .get(executiveController.getExecutive)
  .patch(executiveController.updateExecutive)
  .delete(executiveController.deleteExecutive);

module.exports = router