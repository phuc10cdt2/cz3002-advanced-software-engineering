var User = require('../models/user');
var passport = require('passport');
var async = require('async');
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
                User.find({}).sort({created_at: -1}).exec(function (err, allusers){
                    if(err){
                        console.log(err);
                        res.render('signup', {message: "Error occurs when registering a new user"});
                    }else{
                        var lastusername = allusers[0].username;
                        console.log("LAST NAME " + lastusername);
                        var index = parseInt(lastusername.substring(4), 10) + 1;
                        var username = "user" + index.toString();

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
function getFriendList(username, callback){
    User.findOne({username: username}, function(err, user){
        if(err){
            callback(err);
        }
        else{
            console.log(user.friends);
            callback(null, user.friends);
        }
    });
}
exports.getfriendSuggestion = function(req, res) {
    var user = req.user;
    async.parallel({
        userfriendlist: function(callback){
            getFriendList(user.username, callback);
        },
        getallusers: function(callback){
            User.find({}, function(err, users){
                if(err){
                    callback(err);
                }
                else{
                    callback(null, users);
                }
            });
        }
    },
    function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
        }
        else{
            var friendList = results.userfriendlist;
            var allusers = results.getallusers;
            for(var i = 0; i<allusers.length; i++){
                console.log(allusers[i].username);
                if(friendList.indexOf(allusers[i].username)>-1 || user.username == allusers[i].username){
                    console.log("remove " + allusers[i].username);
                    allusers.splice(i,1);
                    i--;
                }
            }
            res.send(allusers);
        }
    }
    );
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