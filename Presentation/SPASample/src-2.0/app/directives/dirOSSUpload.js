
/*var settingsDemo = {
                    isMultiple:true,  //是否多上传
                    maxFileSize: "=", //in MB 文件大小限制
                    maxFileCount: "=", //最终能上传的文件个数
                    fileTypes: "image/jpg,image/jpeg,image/png,image/gif"
                    isShowDefaultProgress:true/false //是否显示默认进度条
                };
 */
define(['./dirModule', '../public/ossService'], function (module) {
    module.directive('dirOssUpload', ['scopeService', '$rootScope', 'ossService', function (scopeService, $rootScope, ossService) {
        var dirObj = {
            restrict: 'A',
            scope: {
                uploader: '=dirOssUpload',
                settings: "=?settings", //配制对象
                bucketType: "@",// image,video,为空则用上传至默认bucket
                onSuccess: "=",//上传成功回调
                onError: "=",//上传失败回调
            },
            replace: true,
            link: function (scope, element, attrs) {

                var errorMessge = "";
                var uploadifyId = "";
                var accept = "";
                var multiple = "";
                var isShowDefaultProgress = false;
                var isMultiple = false;

                onInit();

                onUpload();

                //上传初始化
                function onInit() {
                    if (angular.isUndefined(scope.uploader) || scope.uploader == null) {
                        scope.uploader = {
                            files: [],//上传成功文件
                            file: {},//单个上传成功的文件
                            progress: null
                        };
                    }

                    //初始化容器
                    var id = 'angular-' + Math.floor((Math.random() * 999999999) + 1);
                    if (attrs.id) {
                        element[0].id = attrs.id;
                    } else {
                        element[0].id = id;
                    }
                    //为指令所在元素append子元素并将uplodify绑定在改element
                    uploadifyId = id + "-OSS-upload";

                    if (!angular.isUndefined(scope.settings)) {
                        //格式限制
                        if (!angular.isUndefined(scope.settings.fileTypes)) {
                            accept = scope.settings.fileTypes;
                        }
                        //是否多文件上传
                        if (!angular.isUndefined(scope.settings.isMultiple)) {
                            isMultiple = scope.settings.isMultiple;
                            multiple = scope.settings.isMultiple ? 'multiple="multiple"' : '';
                        }
                        //是否显示默认进度条
                        if (!angular.isUndefined(scope.settings.isShowDefaultProgress)) {
                            isShowDefaultProgress = scope.settings.isShowDefaultProgress;
                        }
                        //maxFileSize默认2M
                        if (angular.isUndefined(scope.settings.maxFileSize)) {
                            scope.settings.maxFileSize = 2;
                        }
                        //maxFileCount默认15
                        if (angular.isUndefined(scope.settings.maxFileCount)) {
                            scope.settings.maxFileCount = 15;
                        }
                    }

                    getFile();

                    //默认进度条
                    if (isShowDefaultProgress) {
                        element.append(getProgressDom());
                    }
                }

                function getFile() {
                    element.prepend("<input type='file' class='upload' id='" + uploadifyId + "' accept='" + accept + "' " + multiple + " />");
                }

                function getProgressDom() {
                    var dom = ['<div class="upload-progress">',
                                         '    <div id="progress-bar"',
                                         '         class="progress-bar"',
                                         '         role="progressbar"',
                                         '         aria-valuenow="0"',
                                         '         aria-valuemin="0"',
                                         '         aria-valuemax="100" style="min-width: 2em;">',
                                         '        0%',
                                         '    </div>',
                                         '</div>  '].join("")
                    return dom;
                }

                //验证文件
                function checkFile(file) {
                    if (angular.isUndefined(scope.settings)) {
                        return;
                    }

                    //允许上传的文件个数，默认为15
                    if (file.length > scope.settings.maxFileCount)
                    {
                        errorMessge = "文件个数大于上限" + scope.settings.maxFileCount + "个";
                        onError(errorMessge);
                        bootbox.alert(errorMessge);
                        return false;
                    }

                    //允许上传的文件大小, file 默认是以kb为单位
                    if (!angular.isUndefined(scope.settings.maxFileSize)) {
                        for (var i = 0; i < file.length; i++) {
                            if (file[i].size / 1024 > scope.settings.maxFileSize * 1024) {
                                errorMessge = "单个文件不能大于" + scope.settings.maxFileSize + "MB";
                                onError(errorMessge);
                                bootbox.alert(errorMessge);
                                return false;
                            }
                        }
                    }

                    //允许上传的文件类型(image/jpg;/image/jpeg;image/png)
                    if (!angular.isUndefined(scope.settings.fileTypes)) {
                        for (var i = 0; i < file.length; i++) {
                            if (scope.settings.fileTypes.indexOf(file[i].type) == -1) {
                                errorMessge = "文件格式不正确";
                                onError(errorMessge);
                                bootbox.alert(errorMessge);
                                return false;
                            }
                        }
                    }
                }

                //----上传进度
                function onProgress(p) {
                    return function (done) {
                        if (isShowDefaultProgress) {
                            var bar = document.getElementById('progress-bar');
                            bar.style.width = Math.floor(p * 100) + '%';
                            bar.innerHTML = Math.floor(p * 100) + '%';
                        }
                        scope.uploader.progress = Math.floor(p * 100) + '%';
                        scopeService.safeApply(scope);
                        done();
                    }
                };

                //----上传成功触发该事件
                function onSuccess(result) {
                    if (!angular.isUndefined(scope.onSuccess)) {
                        scope.onSuccess(result);
                    }
                    if (isMultiple) {
                        scope.uploader.files.push(result);
                    } else {
                        scope.uploader.files = [];
                        scope.uploader.files.push(result);
                    }
                    scope.uploader.file = result;
                    scopeService.safeApply(scope);
                }

                //----上传失败触发该事件
                function onError(err) {
                    if (!angular.isUndefined(scope.onError)) {
                        scope.onError(err);
                    }
                }

                //----获取OssAbsoluteUrl
                function getOssAbsoluteUrl(ossUrl) {
                    return ossUrl.split('?')[0];
                }

                //获取可访问的url
                function getAbsoluteUrl(fileName, ossUrl) {
                    if (scope.bucketType == 'image') {
                        var absoluteUrl = 'http://' + ossConfig.imageBucket + '.' + ossConfig.imgEndpoint + '/' + fileName;
                        return absoluteUrl;
                    }
                    else {
                        return ossUrl;
                    }
                }

                //上传
                function onUpload() {
                    document.getElementById(uploadifyId).addEventListener('change', function (e) {
                        var file = e.target.files;
                        if (checkFile(file) == false) {
                            return false;
                        }

                        for (var i = 0; i < file.length; i++) {
                            var fileToUpload = file[i];
                            var fileName = utility.newGuid() + "." + fileToUpload.type.split('/')[1];
                            uploadToOss(fileToUpload.name,fileName, fileToUpload);
                        }
                    });
                }

                //上传到oss
                function uploadToOss(originalName,fileName, fileToUpload) {
                    var client = ossService.initClient(scope.bucketType);
                    client.multipartUpload(fileName, fileToUpload,
                        {
                            progress: onProgress
                        })
                    .then(function (result) {
                        var ossAbsoluteUrl = getOssAbsoluteUrl(result.res.requestUrls[0]);
                        var absoluteUrl = getAbsoluteUrl(result.name, ossAbsoluteUrl);
                        var resultModel = {
                            OriginalName: originalName,
                            FileName: result.name,
                            AbsoluteUrl: absoluteUrl,
                            FileSize: result.res.size,
                            OssETag: result.res.headers.etag.replace('"', '').replace('"', ''),
                            OssAbsoluteUrl: ossAbsoluteUrl,
                            IsSuccessToOss:true
                        };
                        onSuccess(resultModel);
                    })
                    .catch(function (err) {
                        console.error(err);
                        onError(err);
                        errorMessge = err;
                        bootbox.alert(errorMessge);
                        return false;
                    });
                }

            } //end link
        };//end dirObj

        return dirObj;
    }]);//end dirOSSUpload

});//end define

