const Announcement = require('../models/announcementModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true)
  else cb(new AppError('Not an image! Please upload only images', 400), false)
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadAnnouncementImages = upload.single('imageCover')

exports.resizeAnnouncementImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.body.imageCover = `announcement-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/images/announcements/${req.body.imageCover}`);
  next()
})

exports.deleteAnnouncementImages = async (req, res, next) => {
  if (req.file) {
    const announcement = await Announcement.findById(req.params.id)
    fs.unlink(`public/images/announcements/${announcement.imageCover}`, (err) => {next()})
  } else return next()
}

exports.getAllAnnouncements = factory.getAll(Announcement);
exports.getAnnouncement = factory.getOne(Announcement);
exports.createAnnouncement = factory.createOne(Announcement);
exports.updateAnnouncement = factory.updateOne(Announcement);
exports.deleteAnnouncement = factory.deleteOne(Announcement);