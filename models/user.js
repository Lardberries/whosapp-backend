var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = module.exports = new Schema({
    username: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    sessionSecret: String
});