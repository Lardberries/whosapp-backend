var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;

var schema = new Schema({
  name: {type: String, required: true},
  users: [ObjectId],
  lastActivity: Date,
  emojiSequence: String,
  emojiCounter: Number,
  sequenceCounter: {type: Number, default: 0}
});

/* Gets next emoji for the chat and increments the counter on the database
 */
schema.methods.getNextEmoji = function getNextEmoji(cb) {
  var chat = this;
  this.model(this.constructor.modelName).findByIdAndUpdate(this._id, {$inc: {emojiCounter: 1}}, function (err, old) {
    if (err) {
      cb(err);
    }
    var emojiArray = chat.emojiSequence.split(',');

    cb(null, emojiArray[old.emojiCounter % emojiArray.length]);
  })
};

/* Gets next emoji for the chat and increments the counter on the database
 */
schema.methods.getNextSequenceNumber = function getNextSequenceNumber(cb) {
  var chat = this;
  this.model(this.constructor.modelName).findByIdAndUpdate(this._id, {$inc: {sequenceCounter: 1}}, function (err, old) {
    if (err) {
      cb(err);
    }
    cb(null, old.sequenceCounter);
  })
};

var Chat = module.exports = mongoose.model('Chat', schema);