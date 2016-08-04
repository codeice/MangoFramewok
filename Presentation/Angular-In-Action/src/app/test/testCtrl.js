define(['../../modules/ctrlModule', '../../directives/dirUploadify', '../../directives/dirUploadImage', '../../directives/dirUploadFile'], function (module) {


    module.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('test',
            {
                url: '/test',
                templateUrl: 'js/controllers/test/test.html?nc=' + Math.random(),
                controller: 'testCtrl'
            })
            .state('test2',
            {
                url: '/test2',
                templateUrl: 'js/controllers/test/test2.html',
                controller: 'testChildCtrl'
            })
            .state('test2.child1',
            {
                url: '/child1',
                templateUrl: 'js/controllers/test/child1.html',
                controller: 'testChildCtrl'
            })
                    .state('test2.child2',
            {
                url: '/child2',
                templateUrl: 'js/controllers/test/child2.html',
                controller: 'testChildCtrl'
            });
    }]);

    module.controller('testCtrl', ['$scope', 'fileService', function ($scope, fileService) {
        $scope.uploadUrl = fileService.getUploadFileUrl();
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

    module.controller('testChildCtrl', ['$scope', 'fileService', function ($scope, fileService) {
        console.log("进入子状态");
    }]);
});