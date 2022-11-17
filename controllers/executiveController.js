const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Executive = require('../models/executiveModel');

exports.getExecutive = catchAsync(async (req, res, next) => {
  const executive = await Executive.findById(req.params.id);
  if (!executive) return next(new AppError('No executive found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: { executive }
  })
})

exports.getAllExecutives = catchAsync(async (req, res, next) => {
  const executives = await Executive.find();
  res.status(200).json({
    status: 'success',
    results: executives.length,
    data: { executives }
  });
})

//createExecutive is only accessible to head-admin, use it for creating new executives only!
exports.createExecutive = catchAsync(async (req, res, next) => {
  const newExecutive = await Executive.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { newExecutive }
  })
})
exports.updateExecutive = catchAsync(async (req, res, next) => {
  const executive = await Executive.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!executive) return next(new AppError('No document found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: { executive }
  })
})

exports.deleteExecutive = catchAsync(async (req, res, next) => {
  const executive = await Executive.findByIdAndDelete(req.params.id);
  if (!executive) return next(new AppError('No document found with that ID', 404));
  res.status(204).json({
    status: 'success',
    data: null
  })
})