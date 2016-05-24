(function () {
    'use strict';
    var userModule = angular.module('user.ctrl', []);

    //----用户列表
    userModule.controller('userCtrl', ['$scope', 'demoService', '$ionicModal', function ($scope, demoService, $ionicModal) {
        /*        //----http service demo
                demoService.getAll().$promise.then(function (response) {
                    $scope.list = response.data.Data;
                    console.log("$scope.list=", $scope.list);
                });*/

        // Some fake testing data
        $scope.persons = demoService.getList();

        //读取缓存模板
        $ionicModal.fromTemplateUrl('modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function (item) {
            $scope.user = angular.copy(item);
            $scope.modal.show();
        };

        //----删除
        $scope.remove = function (item) {
            demoService.remove(item);
        }

    }]);

    //----用户详情
    userModule.controller('userDetailCtrl', ['$scope', '$stateParams', 'demoService', function ($scope, $stateParams, demoService) {
        var userId = $stateParams.userId;
        $scope.user = demoService.getDetail(userId);
    }]);

})();