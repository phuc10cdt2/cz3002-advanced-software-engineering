(function(){
    angular.module('rant').controller('IndexController', function($scope, Rant, Utils){
    	var vm = this;
    	// vm.addFriend = addFriend;
        var temp = Rant.query(function(data){
            $scope.rants = data;
        });
        Utils.getFriendSuggestion().then(function(friends){
        	$scope.friendSuggestions = friends;
        });
		$scope.addFriend = function(friend){
			Utils.addFriend(friend).then(function(res){
				if(res.success){
					friend.added = true;
				}
				else{
					alert("Failed to add this user");
				}
			})
        }
    });
})();
