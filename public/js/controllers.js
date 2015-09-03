(function(){
    angular.module('rant').controller('IndexController', function($scope, Rant, Utils){
        var temp = Rant.query(function(data){
            $scope.rants = data;
        });
    });
})();
