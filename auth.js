var express = require('express');
var User = require('./app/models/user');
var jwt = require('jsonwebtoken');
var config = require('./config');

// route middleware to verify a token
module.exports = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        console.log(err);
      } else {
        // if everything is good, save to request for use in other routes
        User.findById(decoded.id, function(err, user) {
          if (user) {
            req.user = user;
          }
          next();
        });
      }
    });
  } else {
    next();
  }
}
