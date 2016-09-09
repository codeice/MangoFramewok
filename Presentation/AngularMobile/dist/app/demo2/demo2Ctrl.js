(function () {
    'use strict';
    var userModule = angular.module('demo2', ['demo2.service']);

    //----路由配置
    userModule.config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when('/demo2',
            {
                templateUrl: 'app/demo2/demo2-index.html',
                controller: 'demo2Ctrl',
                reloadOnSearch: false
            });
    }]);


    //----用户列表
    userModule.controller('demo2Ctrl', ['$scope', 'demoService', function ($scope, demoService) {
        // Some fake testing data
        $scope.persons = demoService.getList();
    }]);
})();