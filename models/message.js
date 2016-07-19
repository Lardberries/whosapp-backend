var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new Schema({
    sender: ObjectId,
    chatid: ObjectId,
    emoji: String,
    time: Date,
    content: String
});

var Message = module.exports = mongoose.model('User', schema);