var mongoose = require("mongoose")
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: {type: String, required: true},
    displayname:{type:String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    friends: [String],
    created_at: {type: Date},
    updated_at: {type: Date},
    about: {type: String}
});

UserSchema.pre('save', function(next){
    var now = new Date();
    var user = this;
    if(!user.isModified('password'))
        return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err)
                return next(err);
            user.password = hash;
            user.updated_at = now;
            if(!user.created_at){
                user.created_at = now;
            }
            next();
        });
    });
});

UserSchema.methods.verifyPassword = function(user, password){
    return bcrypt.compareSync(password, user.password);
};

var User = mongoose.model('User', UserSchema);
module.exports = User;
