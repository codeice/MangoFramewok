define(['ng-core', '../directives/dirUploadify', '../directives/dirUploadImage', '../directives/dirUploadFile', 'angular-ui-select'], function () {

    var module = angular.module('test', []);
    module.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('test',
            {
                url: '/test',
                templateUrl: 'app/test/test.html?nc=' + Math.random(),
                controller: 'testCtrl'
            })
            .state('test2',
            {
                url: '/test2',
                templateUrl: 'app/test/test2.html',
                controller: 'testChildCtrl'
            })
            .state('test2.child1',
            {
                url: '/child1',
                templateUrl: 'app/test/child1.html',
                controller: 'testChildCtrl'
            })
                    .state('test2.child2',
            {
                url: '/child2',
                templateUrl: 'app/test/child2.html',
                controller: 'testChildCtrl'
            });
    }]);

    module.controller('testCtrl', ['$scope', 'fileService', function ($scope, fileService) {
        $scope.uploadUrl = fileService.uploadImage();
        //////////////////////////////dirUploadify//////////////////////////////
        $scope.uploader = {};
        $scope.uploaderSettings = {
            maxFileSize: 4, //in MB 文件大小限制
            fileTypes: "*.gif;*.jpg;*.xls;*.xlsx;", //可接受的文件类型  '*.gif; *.jpg; *.png',
            isAuto: true,
            isMultiple: true
        };
        $scope.onSuccess = function (file, returnData, uploader) {
            console.log("file=", file);
            console.log("returnData=", returnData);
            console.log("uploader=", uploader);
        }

        ///////////////////////////dirUploadImage///////////////////////////
        /*    $scope.uploadedFile = { fileUrl: "http://localhost/wsaf.portal/images/test.png" };*/


        ///////////////////////////dirUploadFile///////////////////////////

    }]);

    module.controller('testChildCtrl', [
        '$scope', 'fileService', function ($scope, fileService) {
            console.log("进入子状态");
            $scope.model = {
            };

            //select 数据
            $scope.proviceList = [
                { id: 1, name: '上海' },
                { id: 2, name: '北京' },
                { id: 3, name: '深证' },
                { id: 4, name: '广东 ' },
                { id: 5, name: '江西' }
            ];

            $scope.model.provice = { value: $scope.proviceList[0] };


            //-----多选
            $scope.people = [
                 { id: 1, name: 'jessie', age: 12 },
                 { id: 2, name: 'tina', age: 32 },
                 { id: 3, name: 'max', age: 23 },
                 { id: 4, name: 'eva', age: 23 },
                 { id: 5, name: 'bottle', age: 32 }
            ];
            $scope.model.selectedList = [];

        }
    ]);
});