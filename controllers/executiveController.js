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
exports.getAllExecutives = factory.getAll(Executive);
exports.getExecutive = factory.getOne(Executive);
exports.createExecutive = factory.createOne(Executive);
exports.updateExecutive = factory.updateOne(Executive);
exports.deleteExecutive = factory.deleteOne(Executive);