var User = require('../models/user');
var passport = require('passport');

exports.signup = function(req, res){
    var email = req.body.email;
    var username = req.body.name;
    var password = req.body.password;
    var user = new User({
        email: email,
        username: username,
        password: password
    });
    user.save(function(err, user, num){
        if(err){
            res.send("Error occurs when registering a new user");
            console.log(err);
        }
        res.json(user);
    });
};

exports.signin = passport.authenticate('local',
        {   successRedirect: "/",
            failureRedirect: "/signin",
            failureFlash: true
        });

exports.logout = function(req, res){
    req.logout();
    res.redirect('/signin');
}
