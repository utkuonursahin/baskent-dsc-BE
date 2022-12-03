//Module imports
const mongoose = require('mongoose');
//Schema definition
const announcementSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'An announcement must have an description'],
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'An announcement must have an imageCover'],
  },
  name: {
    type: String,
    required: [true, 'An announcement must have a title'],
    unique: true
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'An announcement must have a summary']
  },
  date: {
    type: Date,
    required: [true, 'An announcement must have a date']
  }
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}})
//Creating index
announcementSchema.index({createdAt: 1});
//Creating Announcement model
const Announcement = mongoose.model('Announcement', announcementSchema);
//Module export
module.exports = Announcement;