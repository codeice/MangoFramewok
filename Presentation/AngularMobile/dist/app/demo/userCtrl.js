(function () {
    'use strict';
    var userModule = angular.module('user.ctrl', []);

    /*    //----用户列表
        userModule.controller('userCtrl', ['$scope', 'demoService', function ($scope, demoService) {
            //----http service demo
            demoService.getAll().$promise.then(function (response) {
                $scope.list = response.data.Data;
                console.log("$scope.list=", $scope.list);
            });
    
            // Some fake testing data
            $scope.persons = demoService.getList();
    
        }]);*/

    //----用户列表
    userModule.controller('userCtrl', ['$scope', function ($scope) {

        // Some fake testing data
        $scope.persons = [{ name: "jessie", age: 23 }, { name: "tina", age: 33 }];
        console.log("persons=", $scope.persons);
    }]);



    //----用户详情
    userModule.controller('userDetailCtrl', ['$scope', 'demoService', function ($scope, demoService) {
        var userId = $stateParams.userId;
        $scope.user = demoService.getDetail(userId);
    }]);

})();