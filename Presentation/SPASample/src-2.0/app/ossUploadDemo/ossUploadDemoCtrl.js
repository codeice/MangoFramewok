define(['ng-core', '../directives/dirOssUpload'], function () {

    var module = angular.module('ossUploadDemo', []);
    module.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('ossUploadDemo',
            {
                url: '/ossUploadDemo',
                templateUrl: 'app/ossUploadDemo/ossUploadDemo.html?nc=' + Math.random(),
                controller: 'ossUploadDemoCtrl'
            })
    }]);

    module.controller('ossUploadDemoCtrl', ['$scope', 'fileService', 'matchService', 'scopeService', function ($scope, fileService, matchService, scopeService) {

        var matchId = '5fc57f5d-6fcd-40e1-a485-146c28c1a95f';

        //上传配置
        $scope.uploaderSettings = {
            //fileTypes: 'image/jpg,image/jpeg,image/png,image/gif',
            fileTypes: 'video/mp4',
            isMultiple: false,
            maxFileSize: 200,
            isShowDefaultProgress: false
        };

        $scope.tempPhotos = [];

        //----上传成功回掉
        $scope.onSuccess = function (result) {
            $scope.tempPhotos.push(result);
            scopeService.safeApply($scope);
        }

        //----添加图片
        $scope.addPhotos = function () {
            matchService.addPhotos(matchId, $scope.tempPhotos).$promise.then(function (response) {
                if (response.data.Code == 0) {
                    bootbox.alert("添加成功!");
                    $scope.tempPhotos = [];
                } else {
                    bootbox.alert("添加失败，" + response.data.Message);
                    return false;
                }
            }, function () {
                bootbox.alert("添加失败!");
            });
        }

    }]);
});