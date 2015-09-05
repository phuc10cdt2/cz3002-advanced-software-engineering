var express = require('express');
var router = express.Router();
var pass = require('../config/passport');
var UserController = require('../controllers/UserController');

/* GET users listing. */
router.get('/', pass.ensureAuthenticated, UserController.getAll);

router.get('/friendSuggestion', pass.ensureAuthenticated, UserController.getfriendSuggestion);

router.post('/addfriend', pass.ensureAuthenticated, UserController.addfriend);
module.exports = router;
