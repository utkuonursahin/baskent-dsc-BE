//Module imports
const mongoose = require('mongoose');
//Schema definition
const executivesSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  name: {
    type: String,
    required: [true, 'An executive must have a name'],
    trim: true
  },
  title: {
    type: String,
    enum: ['Başkan', 'Başkan Yardımcısı', 'Yönetim Kurulu Üyesi', 'Asil Üye'],
    required: [true, 'An user must have a title'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
    required: [true, 'An executive must have a photo']
  }
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}})
//Creating Executives model model
const Executive = mongoose.model('Executive', executivesSchema);
//Module export
module.exports = Executive;