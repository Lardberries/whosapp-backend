var express = require('express');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

module.exports = function getUserFromToken(token, cb) {
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        cb(err);
      } else {
        // if everything is good, save to request for use in other routes
        User.findById(decoded.id, cb);
      }
    });
  } else {
    process.nextTick(cb);
  }
};
