var User = require('../models/user');
var passport = require('passport');
var self = this;
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
exports.getAll = function(req, res){
    User.find({}, function(err, users){
        if(err){
            res.sendStatus(500);
        }
        else{
            res.send(users);
        }
    });
}

exports.getfriendSuggestion = function(req, res) {
    var user = req.user;
    //for now, suggest all other users
    User.find({}, function(err, users){
        if(err){
            res.sendStatus(500);
        }
        else{
            for(var i=0; i<users.length; i++){
                var temp = users[i];
                if(temp.username == user.username){
                    users.splice(i, 1);
                    break;
                }
            }
            res.send(users);
        }
    });
}
exports.addfriend = function (req, res, next) {
    var body = req.body;
    var user = req.user;
    var username = user.username;
    var friendUsername = body.username;
    console.log("USRNAME: " + friendUsername);
    User.findOneAndUpdate({username:username},
        {$push: {friends: friendUsername}},
        {safe:true},
        function(err, model){
            if(err){
                console.log("FAILED to add a friend");
                res.sendStatus(500);
            }
            else{
                res.sendStatus(200);
            }
        })
}
