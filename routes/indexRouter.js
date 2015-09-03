var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');
var pass = require('../config/passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated()){
        var user = req.user;
        var displayname = user.displayname;
        if(!displayname){
            displayname = user.username;
        }
        res.render('home', {name: displayname});
    }
    else{
        res.render('signin');
    }
});
router.get('/signup', function(req, res, next){
    res.render('signup');
});
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);
router.get('/signin', function(req, res, next){
    if(req.isAuthenticated()){
        res.render('home');
    }
    else {
        var msg = req.flash("error");
        res.render('signin', {message:msg});
    }
});
router.get('/logout', UserController.logout);
module.exports = router;
