var mongoose = require('mongoose');
var NewMessage = require('./newMessage');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new Schema({
  name: {type: String, required: true},
  users: [ObjectId],
  lastActivity: Date,
  emojiSequence: String,
  emojiCounter: Number
});

schema.methods.getNewMessages = function getNewMessages(cb) {
  NewMessage.find({recipient: this._id}, cb);
};

schema.methods.clearNewMessages = function getNewMessages(cb) {
  NewMessage.remove({recipient: this._id}, cb);
};

/* Gets next emoji for the chat and increments the counter on the database
 */
schema.methods.getNextEmoji = function getNextEmoji(cb) {
  var chat = this;
  this.update({$inc: {emojiCounter: 1}}, function (err, old) {
    if (err) {
      cb(err);
    }
    emojiArray = chat.emojiSequence.split(',');

    cb(null, emojiArray[old.emojiCounter % emojiArray.length]);
  })
};

var Chat = module.exports = mongoose.model('Chat', schema);