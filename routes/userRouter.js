var express = require('express');
var router = express.Router();
var pass = require('../config/passport');
var UserController = require('../controllers/UserController');
var MessageController = require('../controllers/MessageController');

/* GET users listing. */
// router.get('/', UserController.getAll);

router.get('/friendSuggestion', pass.ensureAuthenticated, UserController.getfriendSuggestion);

router.post('/addfriend', pass.ensureAuthenticated, UserController.addfriend);

router.get('/followings', pass.ensureAuthenticated, UserController.getFollowings);

router.post('/unfollow', pass.ensureAuthenticated, UserController.unfollow);

router.post('/message', pass.ensureAuthenticated, MessageController.send);

router.get('/message', pass.ensureAuthenticated, MessageController.retrieve);

router.post('/readmessage', pass.ensureAuthenticated, MessageController.read);

router.get('/*', pass.ensureAuthenticated, UserController.get);

router.post('/', pass.ensureAuthenticated, UserController.update);

module.exports = router;
