var express = require('express');
var router = module.exports = express.Router();

router.get('/api/helloworld', function(req, res) {
	res.send(JSON.stringify({ 'Message': 'Hello World!' }));
});

module.exports = router;