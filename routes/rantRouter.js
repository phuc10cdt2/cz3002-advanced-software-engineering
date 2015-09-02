var express = require('express');
var router = express.Router();
var pass = require('../config/passport');

router.post('/new', function(req, res, next) {
	res.send('Hi, this is not implemented yet :v come back later');
});

module.exports = router;
