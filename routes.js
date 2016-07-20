var express = require('express');
var passport = require('passport');
var User = require('./app/models/user');
var jwt = require('jsonwebtoken');
var config = require('./config');

var router = express.Router();

// route middleware to verify a token
/* router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ 
          'Success': false, 
          'Message': 'Failed to authenticate token.' 
        });    
      } else {
        // if everything is good, save to request for use in other routes
        User.findById(decoded.id, function(err, user) {
          if (error) {
            next();
          }

          if (user) {
            req.user = user;
          }

          next();
        });
      }
    });
  } else {

    // if there is no token
    // return an error
    return res.status(401).send({ 
        'Success': false, 
        'Message': 'No token provided.' 
    });
  }
}); */

module.exports = router;
