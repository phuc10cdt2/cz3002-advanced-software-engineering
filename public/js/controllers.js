(function(){
    var rantControllers = angular.module('rantControllers', []);

    rantControllers.controller('FeedsController', ['$scope', 'Rant', 'Utils', '$http', function ($scope, Rant, Utils, $http) {
        $scope.viewbtn = 'View time';
        $scope.lifebtn = 'Life time';
        var temp = Rant.query(function(data){
            for(var i=0; i<data.length; i++){
                var collapse = data[i].content.substring(0, parseInt(data[i].content.length*0.3, 10));
                data[i].collapse = collapse + '... ';
            }
            $scope.rants = data;
        });
        $('#life-time').popover({title: 'Tips', placement:'right', 
            content: 'After this time elapsed, your rant will be gone forever!'});
        $('#view-time').popover({title: 'Tips', placement:'right', 
            content: 'Your friend can only view this full rant once and within this time!'});
        $scope.setViewtime = function(t){
            $scope.viewtime = t;
            $scope.viewbtn = '' + t + ' seconds';
        }
        $scope.setLifetime = function(t){
            $scope.lifetime = t*3600;
            $scope.lifebtn = '' + t + ' hour';
        }
        $scope.post = function(){
            rant={
                viewtime: $scope.viewtime,
                lifetime: $scope.lifetime,
                anonymous: $scope.anonymous,
                content: $scope.rantContent
            };
            $http.post('/rant', rant).then(refresh, function(err){
                alert(err.data);
            })
        }
        function reset(){
            $scope.rantContent = '';
            $scope.lifetime = '';
            $scope.viewtime = '';
            $scope.lifebtn = 'Life time';
            $scope.viewbtn = 'View time';
        }
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
        function refresh(){
            reset();
            Rant.query(function(data){
                for(var i=0; i<data.length; i++){
                    var collapse = data[i].content.substring(0, parseInt(data[i].content.length*0.3, 10));
                    data[i].collapse = collapse + '... ';
                }
                $scope.rants = data;
            });
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
                    alert(res.data);
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
        // Utils.getMessage().then(function(res){
        //     Messages.messages = res.data;
        //     $scope.messages = Messages.messages;
        // }).catch(function(err){
        //     console.log("FAILED to get messages");
        // });
        $scope.$watch(function(){return Messages.messages;}, function(newVal){
            $scope.messages = Messages.messages;
        });
    }]);

    rantControllers.controller('MessageController', ['$scope', 'Utils', 'Messages', function($scope, Utils, Messages){
        $scope.$watch(function(){return Messages.messages;}, function(newVal){
            $scope.messages = Messages.messages;
        });
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
                spliceRant(rant);
            }, function(err){
                alert("Delete failed");
                console.log(err);
            });
        }
        function spliceRant(rant){
            for(var i =0; i<$scope.rants.length; i++){
                var temp = $scope.rants[i];
                if(temp._id == rant._id){
                    $scope.rants.splice(i, 1);
                    break;
                }
            }
        }
    }]);
    rantControllers.controller('SettingsController', ['$scope', 'User', '$http', function ($scope, User, $http){
        User.get(function(user){
            $scope.user = user;
            $scope.updatedUser = {};
            angular.copy($scope.user, $scope.updatedUser);
        });
        $scope.cancel = function(name) {
            $scope.updatedUser = angular.copy($scope.user);
            $scope.changepassword = false;
            $scope.oldpassword = undefined;
            $scope.newpassword = undefined;
            $scope.repeatpassword = undefined;
        }
        $scope.save = function() {
            $scope.failed = false;
            if($scope.changepassword && ($scope.newpassword != $scope.repeatpassword || typeof($scope.newpassword) == 'undefined' || typeof($scope.repeatpassword) == 'undefined')){
                $scope.message = 'Your password is empty or does not match!';
                $scope.failed = true;
            }
            if(typeof($scope.updatedUser.displayname) == 'undefined'){
                $scope.message = 'Your name cannot be empty!';
                $scope.failed = true;
            }
            console.log($scope.failed);
            if($scope.failed){
                $("#fail-alert").fadeTo(5000, 500).slideUp(500);
                $scope.failed = false;
            }
            else{
                data = {
                    displayname: $scope.updatedUser.displayname, 
                    oldpassword: $scope.oldpassword,
                    newpassword: $scope.newpassword,
                    repeatpassword: $scope.repeatpassword,
                    about: $scope.updatedUser.about
                }
                $http.post('/users/', data).then(function(res){
                    console.log(data);
                    $scope.success = true;
                    $scope.failed = false;
                    location.reload();
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
