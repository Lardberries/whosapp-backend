/* \        / |    |  /¯¯\  /¯¯\   /\   |¯¯\ |¯¯\
 *  \  /\  /  |----| |    | \__   /__\  |__/ |__/
 *   \/  \/   |    |  \__/  \__] /    \ |    |
 */

// dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var config = require('./config');

// main config
var app = express();
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());                        
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', require('./app/controllers/userRouter'));
app.use('/chat', require('./app/controllers/chatRouter'));

// passport config
var User = require('./app/models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose
mongoose.connect(config.database);

// routes
var router = require('./routes');
app.use('/', router);

app.listen(3000, function() {
  console.log('Express server listening on port 3000');
});
