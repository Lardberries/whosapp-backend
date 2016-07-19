var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new Schema({
    recipient: ObjectId, // User
    message: {
        sender: ObjectId, // User
        chatid: ObjectId, // Chat
        emoji: String, // Sender
        time: Date,
        content: String
    }
});

var NewMessage = module.exports = mongoose.model('NewMessage', schema);