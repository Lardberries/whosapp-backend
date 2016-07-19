var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    sessionSecret: String
});

var User = module.exports = mongoose.model('User', schema);