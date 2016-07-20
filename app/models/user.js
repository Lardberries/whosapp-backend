var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var bcrypt = require('bcrypt-nodejs');

var schema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: false},
  name: {type: String, required: true},
  phone: {type: String, required: true},
  sessionSecret: String
});

schema.plugin(passportLocalMongoose);

var User = module.exports = mongoose.model('User', schema);

/* Finds a user from either a phone number or a username
 */
schema.statics.findFromEntry = function findFromEntry(entry, cb) {
  if (!entry || !entry instanceof String) {
    process.nextTick(function() {
      cb(new Error('Expected non-empty string entry'));
    })
  } else if (/^\d+$/.test(entry)) {
    // remove leading 1
    if (entry.length == 10 && entry.substring(0, 1) === '1') {
        entry = entry.substring(1);
    }
    
    // treating as phone number
    User.findOne({ phone: entry }, cb);
  } else {
    // treating as username
    User.findOne({ username: entry.toLowerCase() }, cb);
  }
};