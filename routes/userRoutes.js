const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.isInvited, authController.signup);
router.post('/login', authController.login);
router.get('/isLoggedIn', authController.isLoggedIn)
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Protect all after middlewares from this point
router.use(authController.protect)
router.use(authController.restrictTo('head-admin', 'admin'))
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword', authController.updatePassword);

//Below routes only accessible to head-admins
router.use(authController.restrictTo('head-admin'));

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router;