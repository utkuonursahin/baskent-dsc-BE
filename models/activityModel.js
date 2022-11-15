//Module imports
const mongoose = require('mongoose');
//Schema definition
const activitySchema = new mongoose.Schema({
  createdAt:{
    type:Date,
    default: Date.now(),
    select:false
  },
  description:{
    type:String,
    trim:true,
    required: [true, 'An activity must have an description']
  },
  imageCover: {
    type: String,
    required: [true, 'An activity must have an imageCover'],
  },
  title:{
    type:String,
    required:[true,'An activity must have a title']
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'An activity must have a summary']
  },
  date:{
    type:Date,
    required:[true,'An activity must have a date']
  }
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}})
//Creating index
activitySchema.index({createdAt:1});
//Creating Activity model
const Activity = mongoose.model('Activity',activitySchema);
//Module export
module.exports = Activity;