var express = require('express');
var userRouter = express.Router({ mergeParams: true });
var User = require('../models/user');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// GET - /user/info

// POST - /user/register
userRouter.post('/register', function(req, res) {
  User.register(new User({ username : req.body.username, name: req.body.name, phone: req.body.phone }), 
  	req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.json({
      	'Success': false,
      	'Message': 'That username already exists. Try again.' 
      });
    }

    passport.authenticate('local')(req, res, function() {
      return res.json({
      	'Success': true,
      	'Result': 'User registered successfully'
      });
    });
  });
});

// POST - /user/login
userRouter.post('/login', passport.authenticate('local'), function(req, res) {
  var token = jwt.sign(req.user._id, config.secret, {
    expiresIn: "1d"
  });

  return res.json({
  	'Success': true,
    'Result': token
  });
});

// GET - /user/logout
userRouter.get('/logout', function(req, res) {
  req.logout();
  return res.json({
  	'Success': true,
  	'Result': 'You have successfully logged out'
  });
});

module.exports = userRouter;