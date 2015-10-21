var User = require('../models/user');
var passport = require('passport');
var async = require('async');
var self = this;
var ResponseHelper = require('./ResponseHelper');
exports.signup = function(req, res){
    var email = req.body.email;
    var displayname = req.body.name;
    var password = req.body.password;
    if(email == undefined || displayname == undefined || password == undefined){
        var pagerender = {name: 'signup', data: {message: "Form missing values!"}};
        ResponseHelper.respond(res, pagerender, 500, "Bad request! Registration form not correct");
    }
    User.findOne({email:email}, function(err, user){
        if(err){
            var pagerender = {name: 'signup', data: {message: "Internal server error!"}};
            ResponseHelper.respond(res, pagerender, 500, "Internal server error");
        }
        else{
            if(user){
                console.log("email already used");
                var pagerender = {name: 'signup', data: {message: "Email is already used!"}};
                ResponseHelper.respond(res, pagerender, 400, "Email is already used!");

            }
            else{
                User.find({}).sort({created_at: -1}).exec(function (err, allusers){
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                    }else{
                        if(allusers.length == 0){
                            //Edit
                            var username = 'user0';
                        }
                        else{
                            var lastusername = allusers[0].username;
                            console.log("LAST NAME " + lastusername);
                            var index = parseInt(lastusername.substring(4), 10) + 1;
                            var username = "user" + index.toString();
                        }

                        console.log(username);
                        var newuser = new User({
                            email: email,
                            displayname: displayname,
                            username: username,
                            password: password
                        });
                        newuser.save(function(err, user, num){
                            if(err){
                                res.sendStatus(500);
                                console.log(err);
                            }
                            var pagerender = {name: 'signin'};
                            ResponseHelper.respond(res, pagerender, 200, "Successfully signed up!");
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
    var pagerender = {name: 'signin'};
    ResponseHelper.respond(res, pagerender, 200, "See you again");
}
exports.getAll = function(req, res){
    User.find({}, function(err, users){
        if(err){
            res.status(500).send("Internal server error");
        }
        else{
            res.status(200).send(users);
        }
    });
}
function getFriendList(username, callback){
    User.findOne({username: username}, function(err, user){
        if(err){
            callback(err);
        }
        else{
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
            res.status(500).send("Internal server error");
        }
        else{
            var friendList = results.userfriendlist;
            var allusers = results.getallusers;
            var suggestions = [];
            for(var i = 0; i<allusers.length; i++){
                if(friendList.indexOf(allusers[i].username)>-1 || user.username == allusers[i].username){
                    allusers.splice(i,1);
                    i--;
                }
                else{
                    var friend = {};
                    friend.username = allusers[i].username;
                    friend.displayname = allusers[i].displayname;
                    suggestions.push(friend);
                }
            }
            res.status(200).send(suggestions);
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
                res.status(500).send("Internal server error");
            }
            else{
                res.status(200).send("Added");
            }
        })
};
exports.getFollowings = function (req, res) {
    var body = req.body;
    var user = req.user;
    var username = user.username;
    var followingList = user.friends;
    User.find({
        'username': {
            $in:followingList
        }
    }, 'username displayname', function(err, users){
        if(err){
            res.status(500).send("Internal server error");
        }else{
            res.status(200).send(users);
        }
    });
}

exports.unfollow = function(req, res) {
    var body = req.body;
    var user = req.user;
    var username = user.username;
    var friendUsername = body.username;
    User.update(
        {username: username},
        {$pull: {friends:friendUsername},
    }, function(err, num){
        if(err){
            console.log(err);
            res.status(500).send("Internal server error");            
        }
        else{
            console.log("Unfollowing friend: " + num);
            res.status(200).send("Unfollowed!")
        }
    });
}
exports.get = function (req, res) {
    var username = req.params.username;
    User.findOne({username:username}, function(err, user){
        if(err){
            res.status(500).send("Server error!");
        }
        user = user.toObject()
        delete user['password'];
        delete user['friends'];
        delete user['created_at'];
        console.log(user);
        res.status(200).send(user);
    })
}
exports.update = function(req, res){
    var user = req.user;
    var body = req.body;
    console.log(body);
    var password = body.oldpassword;
    var newpassword = body.newpassword;
    var repeatpassword = body.repeatpassword;
    var changepass = false;

    if(typeof(password) != 'undefined' && typeof(newpassword) != 'undefined' && typeof(repeatpassword) != 'undefined')
        changepass = true;
    // if(newpassword.localeCompare(repeatpassword) != 0){
    //     res.status(400).send("Your repeated password does not match");
    //     changepass = false;
    // }
    var displayname = body.displayname;
    if(typeof(displayname) == 'undefined' || displayname == '')
        res.status(400).send('Your name cannot be empty!');
    User.findOne({username: user.username}, function(err, user){
        if(err){
            res.status(500).send("Database error!");
        }
        if(!user){
            res.status(500).send("Could not find this user. Maybe you are logged out, please try again");
        }
        else{
            if(changepass){
                if(user.verifyPassword(user, password)){
                    user.password = newpassword;
                }
                else{
                    res.status(400).send('Your old password is not correct');
                }
            }
            user.displayname = displayname;
            user.save(function(err){
                if(err){
                    res.status(500).send("Sorry, cannot update your profile, try again later");
                }
                res.status(200).send('Success!');
            });
        }
    });
}