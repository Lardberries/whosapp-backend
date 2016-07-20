var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new Schema({
    sender: {type: ObjectId, required: true}, // User
    chatid: {type: ObjectId, required: true}, // Chat
    emoji: {type: String, required: true}, // Sender
    time: {type: Date, required: true},
    seq: {type: Number, required: true}, // Sequence number
    content: {type: String, required: true}
});

var Message = module.exports = mongoose.model('Message', schema);