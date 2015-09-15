(function(){
    var rantControllers = angular.module('rantControllers', []);

    rantControllers.controller('FeedsController', ['$scope', 'Rant', 'Utils', function ($scope, Rant, Utils) {
        var temp = Rant.query(function(data){
            $scope.rants = data;
        });
    }]);

    rantControllers.controller('FollowingController', ['$scope', 'Utils', function ($scope, Utils) {
        Utils.getFriendSuggestion().then(function(friends){
            $scope.friendSuggestions = friends;
            $scope.suggestionLength = friends.length;
        });
    
        Utils.getFollowings().then(function(res) {
            console.log(res);
            $scope.followings = res.data;
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

})();
