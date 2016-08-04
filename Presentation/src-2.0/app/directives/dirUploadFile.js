///图片上传
define(["../modules/dirModule", "./dirUploadify", '../services/fileService'], function (module) {
    module.directive('dirUploadFile', [
        'scopeService', 'fileService', function (scopeService, fileService) {
            return {
                restrict: "A",
                scope: {
                    uploadedFiles: "=?dirUploadFile", //已上传的文件 [{name:name,url:url}]
                    url: "=", //上传文件地址
                    isMultiple: "@",
                    fileTypes: "@",//允许上传的文件后缀名
                    maxFileSize: "@" //默认MB为单位
                },
                replace: true,
                templateUrl: 'app/directives/templates/uploadFile.html',
                link: function (scope, element, attrs) {
                    if (angular.isUndefined(scope.url) || scope.url == "") {
                        return;
                    }
                    scope.uploader = {};
                    scope.uploaderSettings = {
                        isAuto: false
                    }
                    if (!angular.isUndefined(scope.isMultiple)) {
                        if (scope.isMultiple == "true") {
                            angular.extend(scope.uploaderSettings, { isMultiple: true });
                        } else {
                            angular.extend(scope.uploaderSettings, { isMultiple: false });
                        }
                    }
                    if (!angular.isUndefined(scope.fileTypes)) {
                        angular.extend(scope.uploaderSettings, { fileTypes: scope.fileTypes });
                    }
                    if (!angular.isUndefined(scope.maxFileSize)) {
                        angular.extend(scope.uploaderSettings, { maxFileSize: scope.maxFileSize });
                    }

                    if (angular.isUndefined(scope.uploadedFiles)) {
                        scope.uploadedFiles = [];
                    }
                    //添加文件回调（判断是否存在同名文件）
                    scope.onSelectFile = function (file) {
                        for (var i = 0; i < scope.uploadedFiles.length; i++) {
                            var uploadedFile = scope.uploadedFiles[i];
                            if (uploadedFile.name === file.name) {
                                bootbox.setLocale("zh_CN");
                                bootbox.confirm("已存在同名文件，是否覆盖？", function (result) {
                                    if (result) {
                                        var index = scope.uploadedFiles.indexOf(uploadedFile);
                                        scope.uploadedFiles.splice(index, 1);
                                        scopeService.safeApply(scope);
                                    }
                                });
                            }
                        }
                    }

                    //开始上传
                    scope.startUpload = function () {
                        scope.uploader.getCtrl().uploadAll();
                    }

                    //上传成功回调
                    scope.onSuccess = function (file, returnData) {
                        scope.uploadedFiles.push(returnData);
                        scope.removeToBeUploadedFile(file);
                        scopeService.safeApply(scope);
                    }

                    //从已上传成功的文件中移除文件
                    scope.removeUploadedFile = function (file) {
                        var fileIndex = scope.uploadedFiles.indexOf(file);
                        scope.uploadedFiles.splice(fileIndex, 1);

                        //删除物理文件
                        fileService.removeFile(file.url);
                    }

                    //从待上传队中移除文件
                    scope.removeToBeUploadedFile = function (file) {
                        scope.uploader.getCtrl().removeFile(file);
                        var fileIndex = scope.uploader.files.indexOf(file);
                        scope.uploader.files.splice(fileIndex, 1);
                    }
                } //end link

            }; //end return
        }
    ]); //end dirUploadImage
});
