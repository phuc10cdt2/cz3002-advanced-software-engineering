var express = require('express');
var router = express.Router();
var pass = require('../config/passport');
var UserController = require('../controllers/UserController');

/* GET users listing. */
router.get('/', pass.ensureAuthenticated, UserController.getAll);

router.get('/friendSuggestion', pass.ensureAuthenticated, UserController.getfriendSuggestion);

router.post('/addfriend', pass.ensureAuthenticated, UserController.addfriend);

router.get('/followings', pass.ensureAuthenticated, UserController.getFollowings);

router.post('/unfollow', pass.ensureAuthenticated, UserController.unfollow);
module.exports = router;
