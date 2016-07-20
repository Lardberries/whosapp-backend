/* \        / |    |  /¯¯\  /¯¯\   /\   |¯¯\ |¯¯\
 *  \  /\  /  |----| |    | \__   /__\  |__/ |__/
 *   \/  \/   |    |  \__/  \__] /    \ |    |
 */
var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('localhost', 'whosapp');

app.use('/user', require('./app/controllers/userRouter'));
app.use('/chat', require('./app/controllers/chatRouter'));


app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
