var express = require('express');
var passport = require('passport');
var User = require('./user');
var jwt = require('jsonwebtoken');
var config = require('./config');

var router = express.Router();

router.post('/register', function(req, res) {
  User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
    if (err) {
      return res.render("register", { info: 'Sorry. That username already exists. Try again.' });
    }

    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  var token = jwt.sign(req.user._id, config.secret, {
    expiresIn: "1d"
  });

  res.send(JSON.stringify({
    'Token': token
  }));
});

router.get('/login', function(req, res) {
  res.send('You are logged out');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

// route middleware to verify a token
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
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

    // if there is no token
    // return an error
    return res.status(401).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

router.get('/secure', function (req, res) {
  res.send(JSON.stringify({ 'Message': 'THIS IS SECURE' }));
});

module.exports = router;
