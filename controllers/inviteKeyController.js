const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const InviteKey = require('../models/inviteKeyModel');

exports.getInviteKey = catchAsync(async (req, res, next) => {
  const inviteKey = await InviteKey.findById(req.params.id);
  if (!inviteKey) return next(new AppError('No inviteKey found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: { inviteKey }
  })
})

exports.getAllInviteKeys = catchAsync(async (req, res, next) => {
  const inviteKeys = await InviteKey.find();
  res.status(200).json({
    status: 'success',
    results: inviteKeys.length,
    data: { inviteKeys }
  });
})

exports.createInviteKey = catchAsync(async (req, res, next) => {
  res.status(405).json({
    status: 'not allowed',
    message:"Creating invite keys via this route doesn't support, please use the /invite path for creating new invite keys"
  })
})
exports.updateInviteKey = catchAsync(async (req, res, next) => {
  res.status(405).json({
    status: 'success',
    message:"An invite key can't update after it has been created"
  })
})

exports.deleteInviteKey = catchAsync(async (req, res, next) => {
  const inviteKey = await InviteKey.findByIdAndDelete(req.params.id);
  if (!inviteKey) return next(new AppError('No document found with that ID', 404));
  res.status(204).json({
    status: 'success',
    data: null
  })
})