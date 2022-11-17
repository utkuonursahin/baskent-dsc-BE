const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('No user found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: { user }
  })
})

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
})

//createUser is only accessible to head-admin, use it for creating new admins only!
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { newUser }
  })
})
//updateUser is only for general fields, don't use it for password update! otherwise password won't be hashed!
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!user) return next(new AppError('No document found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: { user }
  })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('No document found with that ID', 404));
  res.status(204).json({
    status: 'success',
    data: null
  })
})