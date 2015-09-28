var express = require('express');
var ResponseHelper = require('../controllers/ResponseHelper');
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
        var pagerender = {name: 'home', data: {name: displayname}};
        ResponseHelper.respond(res, pagerender, 200, user);
    }
    else{
        var pagerender = {name: 'signin'};
        ResponseHelper.respond(res, pagerender, 401, "You are not signed in!");
    }
});
router.get('/signup', function(req, res, next){
    res.render('signup');
});
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);
router.get('/signin', function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/');
    }
    else {
        var msg = req.flash("error");
        var pagerender = {name: 'signin', data: {message: msg}};
        ResponseHelper.respond(res, pagerender, 401, msg);
    }
});
router.get('/logout', UserController.logout);
module.exports = router;
