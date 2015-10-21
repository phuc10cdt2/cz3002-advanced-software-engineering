(function(){
    var rantControllers = angular.module('rantControllers', []);

    rantControllers.controller('FeedsController', ['$scope', 'Rant', 'Utils', '$http', function ($scope, Rant, Utils, $http) {
        var temp = Rant.query(function(data){
            for(var i=0; i<data.length; i++){
                var collapse = data[i].content.substring(0, parseInt(data[i].content.length*0.3, 10));
                data[i].collapse = collapse + '... ';
            }
            $scope.rants = data;
        });
        $scope.viewRant = function (rant) {
            rant.collapse = rant.content;
            rant.viewed = true;
            $http.post('/rant/viewRant', {id: rant._id}).then(function(res){
                console.log(res);
            }, function (res) {
                console.log(res);
            });
            var time = parseInt(rant.viewtime*1000);
            setTimeout(function () {
                $scope.$apply(function(){
                    rant.timeout = true;
                });
            }, time);
        }
    }]);
    rantControllers.controller('SuggestionController', ['$scope', 'Utils', function ($scope, Utils) {
        Utils.getFriendSuggestion().then(function(friends){
            $scope.friendSuggestions = friends;
            $scope.suggestionLength = friends.length;
        });
        $scope.follow = function(friend){
            Utils.addFriend(friend).then(function(res){
                if(res.success){
                    friend.added = true;
                    $scope.suggestionLength--;
                }
                else{
                    alert("Failed to add this user");
                }
            });
        };
    }]);
    rantControllers.controller('FollowingController', ['$scope', 'Utils', function ($scope, Utils) {
        Utils.getFollowings().then(function(res) {
            console.log(res);
            $scope.followings = res.data;
        });
        $scope.unfollow = function(user){
            Utils.unfollow(user).then(function(result){
                if(result.data){
                    console.log("Removed friend!");
                    user.removed = true;
                }
                else{
                    console.log("Does not have such friend to remove!");
                }
            }).catch(function(err){
                console.log(err);
            })
        }
        $scope.open = function(user){
            $scope.receiver = user;
            $('#new-message').modal('show');
            console.log(user.username);
        }
        $scope.send = function(){
            var msg = $('#msg-content').val();
            Utils.message($scope.receiver.username, msg).then(function(res){
                console.log("SEND!");
                $('#msg-content').val("");
                $('#new-message').modal('hide');
                $scope.success = true;
                $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                        $scope.success = false;
                });
            }).catch(function(err){
                console.log("Server error");
            });
        }
    }]);
    rantControllers.controller('HomeController', ['$scope', 'Utils', 'Messages', function($scope, Utils, Messages){    
        Utils.getMessage().then(function(res){
            Messages.messages = res.data;
            $scope.messages = Messages.messages;
        }).catch(function(err){
            console.log("FAILED to get messages");
        });
        $scope.$watch(Messages.messages, function(newval, oldval){
            console.log("updating badge");
            $scope.messages = Messages.messages;
        }, true);
    }]);

    rantControllers.controller('MessageController', ['$scope', 'Utils', 'Messages', function($scope, Utils, Messages){
        Utils.getMessage().then(function(res){
            $scope.messages = res.data;
        }).catch(function(err){
            console.log("FAILED to get messages");
        });
        console.log(Messages.messages);
        $scope.readMessage = function(message) {
            $scope.currentMsg = message;
            message.read = true;
            Messages.remove(message);
            Utils.readMessage(message._id);
            $('#view-message').modal('show');
        }
        $scope.reply = function() {
            var replymsg = $('#reply-message').val();
            Utils.message($scope.currentMsg.sender, replymsg).then(function(res){
                $('#view-message').modal('hide');
                console.log("Replied!");
                $scope.currentMsg = null;
            }).catch(function(err){
                console.log(err);
                console.log("Failed to reply a message");
            });
        }
    }]);
    rantControllers.controller('ProfileController', ['$scope', 'Utils', 'Rant', function ($scope, Utils, Rant) {
        Rant.getMyRant({id: 'myrants'},function(data){
            $scope.rants = data;
        });
        $scope.edit = function (rant){
            console.log('editing');
            rant.editBtnClicked=true;
        }
        $scope.cancel = function(rant) {
            console.log('Cancel editing');
            rant.editBtnClicked=false;
        }
        $scope.save = function (rant){
            rant.$save({id: rant._id}, function(res){
                console.log("Saved!");
            }, function (res) {
                alert('Cannot save now, try again later!');
            });
        }
        $scope.remove = function(rant) {
            rant.$delete({id: rant._id}, function (res){
                console.log("Rant deleted!");
                rant.deleted = true;
            }, function(err){
                alert("Delete failed");
                console.log(err);
            });
        }
        // function spliceRant(rant){
        //     for(var i =0; i<$scope.rants.length; i++){
        //         var temp = $scope.rants[i];
        //         if(temp._id == rant._id){
        //             $scope.rants.splice(i, 1);
        //             break;
        //         }
        //     }
        // }
    }]);
    rantControllers.controller('SettingsController', ['$scope', 'User', '$http', function ($scope, User, $http){
        User.get(function(user){
            $scope.user = user;
            $scope.updatedUser = {};
            angular.copy($scope.user, $scope.updatedUser);
        });
        $scope.cancel = function(name) {
            $scope.updatedUser = angular.copy($scope.user);
        }
        $scope.save = function() {
            if($scope.changepassword && ($scope.newpassword != $scope.repeatpassword || typeof($scope.newpassword) == 'undefined' || typeof($scope.repeatpassword) == 'undefined')){
                $scope.message = 'Your password is empty or does not match!';
                $scope.failed = true;
            }
            if(typeof($scope.updatedUser.displayname) == 'undefined'){
                $scope.message = 'Your name cannot be empty!';
                $scope.failed = true;
            }
            if($scope.failed){
                $("#fail-alert").fadeTo(10000, 500).slideUp(500, function(){
                        $scope.failed = false;
                });
            }
            else{
                data = {
                    displayname: $scope.updatedUser.displayname, 
                    oldpassword: $scope.oldpassword,
                    newpassword: $scope.newpassword,
                    repeatpassword: $scope.repeatpassword
                }
                $http.post('/users/', data).then(function(res){
                    console.log(data);
                    $scope.success = true;
                    $scope.failed = false;
                }, function (res) {
                    console.log('Error!');
                    console.log(res);
                    $scope.failed = true;
                    $scope.message = res.data;
                })
            }
        }
        $scope.changePassword = function () {
            $scope.changepassword = true;
        }
    }]);
})();
