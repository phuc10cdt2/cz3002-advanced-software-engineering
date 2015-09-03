(function(){
    angular.module('rant').factory('Utils', function($sce){
        var utils = {};
        return utils;
    });
    angular.module('rant').factory('Rant', function($resource){
        return $resource('/rant/:id', {id: '@id'});
    });
})();
