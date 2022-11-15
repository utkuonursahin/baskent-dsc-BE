const Activity = require('../models/activityModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
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

exports.uploadActivityImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
])

exports.resizeActivityImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  // 1) Cover image
  req.body.imageCover = `activity-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/activities/${req.body.imageCover}`);
  // 2) Images
  req.body.images = []
  await Promise.all(req.files.images.map(async (file, i) => {
    const filename = `activity-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
    await sharp(file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/activities/${filename}`);
    req.body.images.push(filename)
  }))
  next()
})

exports.getAllActivities = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Activity.find(), req.query).filter().sort().limitFields().paginate()
  const activities = await features.query
  res.status(200).json({
    status: 'success',
    results: activities.length,
    data: { activities }
  })
})

exports.createActivity = catchAsync(async (req, res, next) => {
  const newActivity = await Activity.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { newActivity }
  })
})

exports.getActivity = catchAsync(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) return next(new AppError('No activity found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: { activity }
  })
})

exports.updateActivity = catchAsync(async (req, res, next) => {
  const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!activity) return next(new AppError('No activity found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: { activity }
  })
})

exports.deleteActivity = catchAsync(async (req, res, next) => {
  const activity = await Activity.findByIdAndDelete(req.params.id);
  if (!activity) return next(new AppError('No activity found with that ID', 404));
  res.status(204).json({
    status: 'success',
    data: null
  })
})