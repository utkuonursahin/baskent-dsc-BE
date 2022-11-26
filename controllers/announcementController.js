const Announcement = require('../models/announcementModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
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

exports.getAllAnnouncements = factory.getAll(Announcement);
exports.getAnnouncement = factory.getOne(Announcement);
exports.createAnnouncement = factory.createOne(Announcement);
exports.updateAnnouncement = factory.updateOne(Announcement);
exports.deleteAnnouncement = factory.deleteOne(Announcement);