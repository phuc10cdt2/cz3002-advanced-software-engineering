var assert = require('chai').assert;
var app = require('../app');
var request = require('request');
var User = require("../models/user");

describe('Registration', function() {
    describe('#signup', function () {
        before(function(){
            User.remove({}, function(err){
                if (err) {console.log(err)}
                else{ console.log("Clearing all users before tests!");}
            });
        });
        it('Sign up successfully', function (done) {
            request.post({url: 'http://localhost:8080/signup', form: {email: "test1@gmail.com", name: "David", password: "123"}}, 
                function (err, res, body) {
                    User.find({email: "test1@gmail.com"}, function(err, user){
                        if(err) return done(err);
                        else{
                            assert.equal(user.length, 1, "User created successfully!");
                            done();
                        }
                    });
            });
        });
        it('Sign up with used email', function (done) {
            request.post({url: 'http://localhost:8080/signup', form: {email: "test1@gmail.com", name: "David", password: "123"}}, 
                function (err, res, body) {
                    User.find({email: "test1@gmail.com"}, function(err, user){
                        if(err) return done(err);
                        else{
                            assert.equal(user.length, 1, "Number of user is still 1. Register with used email is not allowed!");
                            done();
                        }
                    });
            });
        });
        after(function(){
            User.remove({}, function (err) {
                if(err){
                    console.log("Cannot clear all users!");
                }
                else{
                    console.log("Cleared all users after tests");
                }
            });
        })
    });
});