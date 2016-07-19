var mongoose = require('mongoose');
var NewMessage = require('./newMessage');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new Schema({
  name: {type: String, required: true},
  users: [ObjectId]
});

schema.methods.getNewMessages = function getNewMessages(cb) {
  NewMessage.find({recipient: this._id}, cb);
};

schema.methods.clearNewMessages = function getNewMessages(cb) {
  NewMessage.remove({recipient: this._id}, cb);
};

var Chat = module.exports = mongoose.model('Chat', schema);