///图片上传
define(['../modules/dirModule', "./dirUploadify"], function (module) {
    module.directive('dirUploadImage', [
        'scopeService', '$rootScope', function (scopeService, $rootScope) {
            return {
                restrict: "A",
                scope: {
                    uploadedFile: "=?dirUploadImage", //已上传的文件
                    url: "=" //上传文件地址
                },
                replace: true,
                templateUrl: 'app/directives/templates/uploadImage.html',
                link: function (scope, element, attrs) {
                    if (angular.isUndefined(scope.url) || scope.url == "") {
                        return;
                    }
                    scope.uploader = {};
                    scope.appConfig = $rootScope.appConfig;
                    scope.uploaderSettings = {
                        isAuto: true,
                        isMultiple: false,
                        fileTypes: "*.gif;*.jpg;*.jpeg;*png;*.bmp;*.tiff;"//可接受的文件类型  '*.gif; *.jpg; *.png',
                    }

                    //上传成功回调
                    scope.onSuccess = function (file, returnData, uploader) {
                        scope.uploadedFile = {};
                        scope.uploadedFile = returnData;
                        scopeService.safeApply(scope);
                    }
                }//end link

            };//end return
        }
    ]);//end dirUploadImage
});