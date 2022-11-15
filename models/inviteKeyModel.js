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
  expiresAt:{
    type:Date,
    default:new Date(Date.now() + process.env.INVITE_KEY_EXPIRES_IN * 60 * 1000)
  },
  active:{
    type:Boolean,
    default:true
  }
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}})
//Set timeout for deleting invite key by default.
inviteKeySchema.pre('save', function (next) {
  if (!this.active) return next();
  setTimeout(()=>this.remove(),this.expiresAt - Date.now());
  next();
})

inviteKeySchema.methods.createInviteToken = function(){
  const token = crypto.randomBytes(64).toString('hex').slice(0, 8).toUpperCase();
  this.key = crypto.createHash('sha256').update(token).digest('hex');
  return token;
}

//Creating Activity model
const inviteKey = mongoose.model('InviteKey',inviteKeySchema);
//Module export
module.exports = inviteKey;