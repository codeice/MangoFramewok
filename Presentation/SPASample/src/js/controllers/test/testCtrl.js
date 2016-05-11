define(['../../modules/ctrlModule', '../../directives/dirUploadify', '../../directives/dirUploadImage', '../../directives/dirUploadFile'], function (module) {
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
});