(function () {
    'use strict';
    var userModule = angular.module('user', ['user.service']);

    //----路由配置
    userModule.config(["$routeProvider", function ($routeProvider) {
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
    }]);


    //----用户列表
    userModule.controller('userCtrl', ['$scope', 'demoService', function ($scope, demoService) {

        // Some fake testing data
        $scope.persons = demoService.getList();

    }]);

    //----用户详情
    userModule.controller('userDetailCtrl', ['$scope', '$routeParams', 'demoService', 'uiKit', function ($scope, $routeParams, demoService, uiKit) {
        var userId = $routeParams.id;
        $scope.user = demoService.getDetail(userId);

        $scope.showMsg = function () {
            uiKit.message('服务报错...');
        };

        $scope.showAlert = function () {
            uiKit.alert("alert 弹出框框");
        }

        $scope.showConfirm = function () {
            uiKit.confirm("确认删除？").then(function () {
                console.log("确认");
            }, function () {
                console.log("取消");
            });
        }
    }]);

})();