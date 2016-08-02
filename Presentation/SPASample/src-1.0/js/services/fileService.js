define(['../modules/serviceModule'], function (module) {
    function FileService($rootScope, service, backgroundService) {

        ///////////////////上传文件的url////////////////////
        this.getUploadFileUrl = function () {
            /*  return $rootScope.appConfig.apiServer + "File/Upload";*/
            return "http://localhost/ps.api/File/Upload";
        }

        //----从文件系统删除文件
        this.removeFile = function (fileUrl) {
            /* return backgroundService.call("File/RemoveFile", { fileUrl: fileUrl }, "post");*/
            return backgroundService.call("http://localhost/ps.api/File/RemoveFile", { fileUrl: fileUrl }, "post");
        }

        //----下载模板文件
        this.downloadTemplate = function (templateName) {
            backgroundService.call("File/DownloadTemplate", { name: templateName }, "post").$promise.then(function (response) {
                if (response.data.IsSuccess) {
                    var fileUrl = response.data.Result;
                    if (fileUrl.indexOf('http') < 0) {
                        fileUrl = window.location.protocol + "//" + window.location.host + fileUrl;
                    }
                    window.open(fileUrl);
                } else {
                    bootbox.alert(response.data.ErrorMessage);
                }
            }, function () {
                bootbox.alert("下载文件失败");
            });
        }
    }

    module.factory("fileService", ['$rootScope', 'service', 'backgroundService', function ($rootScope, service, backgroundService) {
        var fileService = new FileService($rootScope, service, backgroundService);
        return fileService;
    }]);
});