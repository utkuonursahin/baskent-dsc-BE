const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Executive = require('../models/executiveModel');
const factory = require('./handlerFactory');
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

exports.uploadExecutiveImage = upload.single('photo')

exports.resizeExecutiveImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.body.photo = `executive-${req.params.id}-${Date.now()}.jpeg`
  await sharp(req.file.buffer)
    .resize(1333, 2000)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/images/executives/${req.body.photo}`);
  next()
})
exports.getAllExecutives = factory.getAll(Executive);
exports.getExecutive = factory.getOne(Executive);
exports.createExecutive = factory.createOne(Executive);
exports.updateExecutive = factory.updateOne(Executive);
exports.deleteExecutive = factory.deleteOne(Executive);