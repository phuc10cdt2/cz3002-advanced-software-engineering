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

    }]);

})();
