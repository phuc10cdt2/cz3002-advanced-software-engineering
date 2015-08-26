var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');
var pass = require('../config/passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated()){
        res.render('home');
    }
    else{
        var msg = req.flash("error");
        res.render('signin', {message: msg});
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
        res.render('signin');
    }
});

module.exports = router;
