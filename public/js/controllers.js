(function(){
    var rantControllers = angular.module('rantControllers', []);

    rantControllers.controller('FeedsController', ['$scope', 'Rant', 'Utils', function ($scope, Rant, Utils) {
        var temp = Rant.query(function(data){
            $scope.rants = data;
        });
        
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
    rantControllers.controller('HomeController', ['$scope', 'Utils', function($scope, Utils){    
        Utils.getMessage().then(function(res){
            $scope.messages = res.data;
        }).catch(function(err){
            console.log("FAILED to get messages");
        });
    }]);

    rantControllers.controller('MessageController', ['$scope', 'Utils', function($scope, Utils){
        Utils.getMessage().then(function(res){
            $scope.messages = res.data;
        }).catch(function(err){
            console.log("FAILED to get messages");
        });

        $scope.readMessage = function(message) {
            $scope.currentMsg = message;
            $('#view-message').modal('show');
        }
        $scope.reply = function() {
            var replymsg = $('#reply-message').val();
            Utils.replyMessage($scope.currentMsg.sender, $scope.currentMsg._id, replymsg).then(function(res){
                $('#view-message').modal('hide');
                console.log("Replied!");
                $scope.currentMsg = null;
            }).catch(function(err){
                console.log(err);
                console.log("Failed to reply a message");
            });
        }
    }]);
})();
