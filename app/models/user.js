var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')
var bcrypt = require('bcrypt-nodejs');

var schema = new Schema({
    username: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    sessionSecret: String
});

schema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', schema);
