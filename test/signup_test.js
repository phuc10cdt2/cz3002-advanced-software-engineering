var assert = require('chai').assert;
var request = require('request');
var server = require('../app');
var User = require("../models/user");

describe('Registration', function() {
    describe('#signup', function () {
        before(function(done){
            User.remove({}, function(err){
                if (err) {
                    console.log(err);
                    done(err);
                }
                else{ 
                    console.log("Clearing all users before tests!");
                    done();
                }
            });
        });
        it('Should succeed when sign up a new user with valid email', function (done) {
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
        it('Should fail when sign up with a used email', function (done) {
            request.post({url: 'http://localhost:8080/signup', form: {email: "test1@gmail.com", name: "David", password: "123"}}, 
                function (err, res, body) {
                    User.find({email: "test1@gmail.com"}, function(err, user){
                        if(err) return done(err);
                        else{
                            assert.equal(user.length, 1, "Added a new user. number of user is 1.");
                            request.post({url: 'http://localhost:8080/signup', form: {email: "test1@gmail.com", name: "Jen", password: "123"}}, 
                                function (err, res, body){
                                    User.find({email: "test1@gmail.com"}, function(err, user){
                                        if(err) return done(err);
                                        assert.equal(user.length, 1, "Number of user is still 1. Register with used email is not allowed!");
                                        assert.equal(user[0].displayname, "David", "user is not Jen but David");
                                        done();
                                    });
                                });
                        }
                });
            });
        });
        it('Should fail when sign up a new user without password', function (done) {
            request.post({url: 'http://localhost:8080/signup', form: {email: "test2@gmail.com", name: "Nina"}}, 
                function (err, res, body) {
                    User.find({email: "test2@gmail.com"}, function(err, user){
                        if(err) return done(err);
                        else{
                            assert.equal(user.length, 0, "User not found in database!");
                            done();
                        }
                    });
            });
        });
        it('Should fail when sign up a new user without name', function (done) {
            request.post({url: 'http://localhost:8080/signup', form: {email: "test3@gmail.com", password: "Nina"}}, 
                function (err, res, body) {
                    User.find({email: "test2@gmail.com"}, function(err, user){
                        if(err) return done(err);
                        else{
                            assert.equal(user.length, 0, "User not found in database!");
                            done();
                        }
                    });
            });
        });
        afterEach(function(done){
            User.remove({}, function (err) {
                if(err){
                    console.log("Cannot clear all users!");
                    done(err);
                }
                else{
                    console.log("Cleared all users after tests");
                    done();
                }
            });
        });
        after(function(done){
            server.close();
            done();
        });
    });
});