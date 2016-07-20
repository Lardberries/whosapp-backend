var express = require('express');
var userRouter = module.exports = express.Router({mergeParams: true});

// GET - /user/info

// POST - /user/login
userRouter.post('/Login', function(req, resp) {

});

module.exports = userRouter;