(function () {
    'use strict';
    var userModule = angular.module('user', ['user.service']);

    //----路由配置
    userModule.config(function ($routeProvider) {
        $routeProvider
            .when('/users',
            {
                templateUrl: 'app/demo/user-list.html',
                controller: 'userCtrl',
                reloadOnSearch: false
            }).when('/users/:id', {
                templateUrl: 'app/demo/user-detail.html',
                controller: 'userDetailCtrl',
                reloadOnSearch: false
            });
    });


    //----用户列表
    userModule.controller('userCtrl', ['$scope', 'demoService', function ($scope, demoService) {

        //----http service demo
        demoService.getAll().$promise.then(function (response) {
            $scope.list = response.data.Data;
            console.log("$scope.list=", $scope.list);
        });

        // Some fake testing data
        $scope.persons = demoService.getList();

    }]);

    //----用户详情
    userModule.controller('userDetailCtrl', ['$scope', '$routeParams', 'demoService', function ($scope, $routeParams, demoService) {
        var userId = $routeParams.id;
        $scope.user = demoService.getDetail(userId);
        console.log("$scope.user=", $scope.user);


    }]);

})();