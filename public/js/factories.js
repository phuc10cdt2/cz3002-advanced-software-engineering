(function(){
    angular.module('rant').factory('Utils', function($http){
        return {
            getFriendSuggestion: getFriendSuggestion,
            addFriend: addFriend,
            getFollowings: getFollowings,
            unfollow: unfollow,
            message: message,
            getMessage: getMessage,
            readMessage: readMessage
        };
        function getFollowings (username) {
            return $http.get('/users/followings');
        }
        function getFriendSuggestion(){
        	return $http.get('/users/friendSuggestion')
                .then(success)
                .catch(failure);
            function success(res){
                return res.data;
            }
            function failure(res){
                console.log("Error fetching friend suggestions");
            }
        }

        function addFriend(friend){
            console.log("sending add friend");
            var username = friend.username;
            return $http.post('/users/addfriend', {username: username})
                .then(success)
                .catch(failure);
            function success(res){
                return {success: true};
            }
            function failure(res){
                return {success:false};
            }
        }

        function unfollow (friend) {
            var username = friend.username;
            return $http.post('/users/unfollow', {username: username});
        }

        function message(friend, msg){
            return $http.post('users/message', {receiver: friend, message: msg});
        }

        function getMessage(){
            return $http.get('users/message');
        }
        function readMessage(msgid){
            return $http.post('users/readmessage', {msgid: msgid});
        }
    });
    angular.module('rant').factory('Messages', function() {
        var Messages = {};
        Messages.messages = [];
        Messages.remove = function(msg){
                            for(var i=0; i<Messages.messages.length; i++){
                                var m = Messages.messages[i];
                                if(m._id == msg._id){
                                    console.log("REEEEEMOOVe");
                                    Messages.messages.slice(i, 1);
                                }
                            }
                        }
        return Messages;
    });
    // angular.module('rant').factory('Rant', function($resource){
    //     return $resource('/rant/:id', {id: '@id'});
    // });
    angular.module('rant').factory('User', function($resource){
    	return $resource('/users/:id', {id: '@id'});
    });
    angular.module('rant').factory('Rant', function($resource){
        return $resource('/rant/:id', {id: '@id'},
            {
                getMyRant: { method: 'GET', isArray: true}
            });
    });
})();
