const Announcement = require('../models/announcementModel');
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

exports.uploadAnnouncementImages = upload.fields([
  {name: 'imageCover', maxCount: 1}
])

exports.resizeAnnouncementImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover) return next();
  // 1) Cover image
  req.body.imageCover = `announcement-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/images/announcements/${req.body.imageCover}`);
  next()
})

exports.getAllAnnouncements = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Announcement.find(), req.query).filter().sort().limitFields().paginate()
  const announcements = await features.query
  res.status(200).json({
    status: 'success',
    results: announcements.length,
    data: {announcements}
  })
})

exports.createAnnouncement = catchAsync(async (req, res, next) => {
  const newAnnouncement = await Announcement.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {newAnnouncement}
  })
})

exports.getAnnouncement = catchAsync(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) return next(new AppError('No Announcement found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: {announcement}
  })
})

exports.updateAnnouncement = catchAsync(async (req, res, next) => {
  const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
  if (!announcement) return next(new AppError('No Announcement found with that ID', 404));
  res.status(200).json({
    status: 'success',
    data: {announcement}
  })
})

exports.deleteAnnouncement = catchAsync(async (req, res, next) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) return next(new AppError('No Announcement found with that ID', 404));
  res.status(204).json({
    status: 'success',
    data: null
  })
})