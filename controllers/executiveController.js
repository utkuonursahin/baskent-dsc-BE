const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Executive = require('../models/executiveModel');
const APIFeatures = require('../utils/apiFeatures');
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true)
  else cb(new AppError('Not an image! Please upload only images', 400), false)
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadExecutiveImage = upload.fields([
  {name: 'photo', maxCount: 1}
])

exports.resizeExecutiveImage = catchAsync(async (req, res, next) => {
  if (!req.files.photo) return next();
  // 1) Cover image
  req.body.photo = `executive-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.files.photo[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/images/executives/${req.body.photo}`);
  next()
})


exports.getExecutive = catchAsync(async (req, res, next) => {
  const executive = await Executive.findById(req.params.id);
  if (!executive) return next(new AppError('No executive found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: {executive}
  })
})

exports.getAllExecutives = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Executive.find(), req.query).filter().sort().limitFields().paginate()
  const executives = await features.query
  res.status(200).json({
    status: 'success',
    results: executives.length,
    data: {executives}
  });
})

//createExecutive is only accessible to head-admin, use it for creating new executives only!
exports.createExecutive = catchAsync(async (req, res, next) => {
  const newExecutive = await Executive.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {newExecutive}
  })
})
exports.updateExecutive = catchAsync(async (req, res, next) => {
  const executive = await Executive.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
  if (!executive) return next(new AppError('No document found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: {executive}
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