(function(){
    angular.module('rant', ['ngResource', 'ngRoute', 'rantControllers']);
    angular.module('rant').config(['$routeProvider', function($routeProvider){
    	$routeProvider.
    		when('/', {
    			templateUrl: '/partials/feeds',
    			controller: 'FeedsController'
    		})
    		.when('/messages', {
    			templateUrl: 'partials/messages.jade',
    			controller: 'MessageController'
    		}).
    		when('/rants', {
    			templateUrl: 'partials/profile.jade',
    			controller: 'ProfileController'
    		}).
    		when('/settings', {
                templateUrl: 'partials/settings.jade',
    			controller: 'SettingsController'
    		}).
    		when('/followings', {
                templateUrl: 'partials/followings',
    			controller: 'FollowingController'
    		}).
    		otherwise({
    			redirectTo: '/'
    		});
    }]);
})();