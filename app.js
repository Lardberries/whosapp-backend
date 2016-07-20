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
var WebSocket = require('ws');
var getUserFromToken = require('./app/utils/auth');

var config = require('./config');

var server = require('http').createServer();

// connect web socket
require('./app/controllers/messageQueue').init(server);

// main config
var app = express();
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());                        
app.use(bodyParser.urlencoded({ extended: true }));

// auth middleware
app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  getUserFromToken(token, function (err, user) {
    if (err) {
      console.err(err);
    }
    req.user = user;
    next();
  });
});

app.use('/user', require('./app/controllers/userRouter'));
app.use('/chat', require('./app/controllers/chatRouter'));

// passport config
var User = require('./app/models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoose
mongoose.connect(config.database);

// attach express to server
server.on('request', app);

server.listen(config.port, function() {
  console.log('Express server listening on port ' + config.port);
});
