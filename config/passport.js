var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.serializeUser(function(user, done) {
    console.log('serializing user: ');console.log(user);
    done(null, user._id);
});

passport.use(new LocalStrategy(
    function(username, password, done){
        User.findOne({email:username}, function(err, user){
            if(err){
                console.log("Error!")
                return done(err);
            }
            if(!user){
                console.log("No such user");
                return done(null, false, {message: "Incorrect username"});
            }
            if(!user.verifyPassword(user, password)){
                console.log("Wrong password");
                return done(null, false, {message: "Incorrect password"});
            }
            return done(null, user);
        });
    }
));

exports.ensureAuthenticated = function(req, res, next){
    if(req.isAuthenticated()){return next();}
    res.redirect('/signin');
}
