var assert = require('chai').assert;
var request = require('request');
var server = require('../app');
var User = require("../models/user");

describe('Registration', function() {
    describe('#signup', function () {
        beforeEach(function(done){
            var newuser = new User({
                            email: "test@gmail.com",
                            displayname: "tester",
                            username: "user1",
                            password: "123"
                        });
            newuser.save(function(err, user, num){
                if(err) done(err);
                else done()
            });
        });
        it('Should succeed when sign in a created user', function (done) {
            var jar = request.jar();
            request.post({url: 'http://localhost:8080/signin', 
                headers: {
                    'accept': 'application/json'
                },
                followAllRedirects: true,
                jar: jar,
                form: {username: "test@gmail.com", password: "123"}}, 
                function (err, res, body) {
                    assert.equal(res.statusCode, 200);
                    request.get('http://localhost:8080/logout', function(){
                        done();
                    });
            });
        });
        it('Should fail when sign in with wrong password', function (done) {
            var jar = request.jar();
            request.post({url: 'http://localhost:8080/signin',
                headers: {
                    'accept': 'application/json'
                },
                followAllRedirects: true,
                jar: jar,
                form: {username: "test@gmail.com", password: "1234"}}, 
                function (err, res, body) {
                    console.log(body);
                    assert.equal(res.statusCode, 401);
                    done();
            });
        });
        after(function(done){
            server.close();
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
        })
    });
});

