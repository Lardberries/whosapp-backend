var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new Schema({
    sender: ObjectId, // User
    chatid: ObjectId, // Chat
    emoji: String, // Sender
    time: Date,
    content: String
});

var Message = module.exports = mongoose.model('Message', schema);