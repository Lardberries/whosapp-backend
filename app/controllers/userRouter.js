var express = require('express');
var userRouter = express.Router({ mergeParams: true });
var User = require('../models/user');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var _ = require('underscore');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// GET - /user/info
userRouter.get('/info', function (req, res) {
  if (!req.user) {
    return res.status(403).send('Unauthorized');
  }

  User.findOne({_id: ObjectId(req.user._id)}, function (err, user) {
    if (err) {
      console.error(err.stack);
      return res.status(500).send('Something broke!');
    }

    res.send(_.pick(user, 'username', 'name', 'phone'));
  });
});

// POST - /user/register
userRouter.post('/register', function(req, res) {
  console.log('1');
  User.register(new User({ username : req.body.username.toLowerCase(), name: req.body.name, phone: req.body.phone }), 
  	req.body.password, function(err, user) {
    if (err) {
      console.log(err.stack);
      return res.json({
      	'Success': false,
      	'Message': 'An error occurred.' 
      });
    }

    passport.authenticate('local')(req, res, function() {
      var token = jwt.sign(req.user._id, config.secret, {
        expiresIn: "1d"
      });

      return res.json({
        'Success': true,
        'Result': token
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
