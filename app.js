/* \        / |    |  /¯¯\  /¯¯\   /\   |¯¯\ |¯¯\
 *  \  /\  /  |----| |    | \__   /__\  |__/ |__/
 *   \/  \/   |    |  \__/  \__] /    \ |    |
 */
var express = require('express');
var app = express();
var router = require('router');

app.use(router);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
