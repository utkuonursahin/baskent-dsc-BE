//Module imports
const mongoose = require('mongoose');
const crypto = require("crypto");
//Schema definition
const inviteKeySchema = new mongoose.Schema({
  createdAt:{
    type:Date,
    default: Date.now(),
    select:false
  },
  key:String,
  expireAt:{
    type:Date,
    expires: process.env.INVITE_KEY_EXPIRES_IN * 60,
    default:new Date(Date.now() + process.env.INVITE_KEY_EXPIRES_IN * 60 * 1000)
  },
  active:{
    type:Boolean,
    default:true
  }
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}})

inviteKeySchema.methods.createInviteToken = function(){
  const token = crypto.randomBytes(64).toString('hex').slice(0, 8).toUpperCase();
  this.key = crypto.createHash('sha256').update(token).digest('hex');
  return token;
}

//Creating inviteKey model
const InviteKey = mongoose.model('InviteKey',inviteKeySchema);
//Module export
module.exports = InviteKey;