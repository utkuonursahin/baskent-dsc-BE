const catchAsync = require('../utils/catchAsync');
const InviteKey = require('../models/inviteKeyModel');
const factory = require('./handlerFactory');

exports.getAllInviteKeys = factory.getAll(InviteKey);
exports.getInviteKey = factory.getOne(InviteKey);
exports.createInviteKey = catchAsync(async (req, res, next) => {
  res.status(405).json({
    status: 'not allowed',
    message: "This route doesn't support creating invite key, please use /invite path for creating new invite keys"
  })
})
exports.updateInviteKey = catchAsync(async (req, res, next) => {
  res.status(405).json({
    status: 'not allowed',
    message: "An invite key can not be updated after it has been created"
  })
})
exports.deleteInviteKey = factory.deleteOne(InviteKey);