var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new Schema({
    name: {type: String, required: true},
    users: [ObjectId]
});

var Chat = module.exports = mongoose.model('User', schema);