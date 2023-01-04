const {promisify} = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const InviteKey = require('../models/inviteKeyModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

const signToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarder-proto'] === 'https'
  });
  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {user}
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: req.body.passwordResetExpires,
  });
  const url = `${req.protocol}://${req.get('host')}/me`
  await new Email(newUser, url).sendWelcome()
  createSendToken(newUser, 201, req, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body
  if (!email || !password) return next(new AppError('Please provide email and password', 400))
  const user = await User.findOne({email}).select('+password')
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }
  createSendToken(user, 200, req, res)
})

exports.logout = (req, res) => {
  res.clearCookie('jwt')
  res.status(200).json({status: 'success'})
}

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) token = req.cookies.jwt
  if (!token) return next(new AppError('You are not logged in, please log in to get access', 401));
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) return next(new AppError('The user belonging to this token does not exist', 401))
  if (currentUser.changedPasswordAfter(decoded.iat)) return next(new AppError('User recently changed password. Please log in again', 401))
  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next()
})

//Only for rendered pages, no errors!
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id)
      if (!currentUser) return next()
      if (currentUser.changedPasswordAfter(decoded.iat)) return next()
      //There is a logged in user
      res.status(200).json({
        status: 'success',
        data: currentUser
      });
    } catch (error) {
      return next()
    }
  } else {
    res.status(404).json({
      status: 'fail',
      data: null
    });
  }
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError('You do not have permission to perform this action', 403))
    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email})
  if (!user) return next(new AppError('There is no user with this email address', 404))
  const resetToken = user.createPasswordResetToken()
  await user.save({validateBeforeSave: false})
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    await new Email(user, resetURL).sendPasswordReset()
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    })
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false})
    return next(new AppError('There was an error sending the email. Try again later', 500))
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt: Date.now()}
  });
  if (!user) return next(new AppError('Token is invalid or has expired', 400))
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, req, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) return next(new AppError('Your current password is incorrect!', 403))
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()
  createSendToken(user, 200, req, res)
})

exports.invite = catchAsync(async (req, res, next) => {
  await InviteKey.deleteMany({active: {$ne: true}});
  const inviteKey = await InviteKey.create({});
  //createInviteToken returns a not hashed version of randomly created token
  const inviteToken = inviteKey.createInviteToken();
  await inviteKey.save();
  res.status(201).json({
    status: 'success',
    data: {inviteToken}
  })
})

exports.isInvited = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
  const inviteKey = await InviteKey.findOne({active: {$ne: false}, key: hashedToken});
  if (!inviteKey) return next(new AppError('This invite key is invalid or already used.', 403));
  //Mark key as inactive for delete it, when invite function works next time;
  inviteKey.active = false;
  await inviteKey.save();
  next();
})