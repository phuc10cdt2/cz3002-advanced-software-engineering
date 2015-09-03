var User = require('../models/user');
var passport = require('passport');

exports.signup = function(req, res){
    var email = req.body.email;
    var displayname = req.body.name;
    var password = req.body.password;
    User.findOne({email:email}, function(err, user){
        if(err){
            console.log("Crashed when siging up user");
            res.send("Server is having a problem, try again later!");
        }
        else{
            if(user){
                console.log("email already used");
                res.render('signup', {message: "Email is already used!"});
            }
            else{
                User.count({}, function (err, count){
                    if(err){
                        console.log(err);
                        res.render('signup', {message: "Error occurs when registering a new user"});
                    }else{
                        var username = "user" + count;
                        console.log(username);
                        var newuser = new User({
                            email: email,
                            displayname: displayname,
                            username: username,
                            password: password
                        });
                        newuser.save(function(err, user, num){
                            if(err){
                                res.render('signup', {message: "Error occurs when registering a new user"});
                                console.log(err);
                            }
                            res.redirect('/');
                        });
                    }
                });

            }
        }
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
