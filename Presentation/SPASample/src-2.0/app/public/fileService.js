define(['angular-ui-router'], function () {
    var module = angular.module('file', []);
    function FileService($rootScope, service, backgroundService) {
        ///////////////////上传文件的url////////////////////
        this.uploadImage = function () {
            return this.upload("images",true);
        };


        // ----上传文件到本地
        this.upload = function (category, isToOss) {
            return $rootScope.appConfig.apiServer + "Files/Upload/" + category + "/" + isToOss;
        };

    }

    module.factory("fileService", ['$rootScope', 'service', 'backgroundService', function ($rootScope, service, backgroundService) {
        var fileService = new FileService($rootScope, service, backgroundService);
        return fileService;
    }]);
});