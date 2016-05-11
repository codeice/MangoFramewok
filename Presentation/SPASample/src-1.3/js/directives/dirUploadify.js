/* e.g:          
var settingsDemo = {
                    isAuto:ture,
                    isMultiple:true,
                    maxFileSize: "=", //in MB 文件大小限制
                    maxFileCount: "=", //最终能上传的文件个数
                    fileTypes: "*.gif;*.jpg;*.xls;*.xlsx;"
                };
 */
/*
 * tree 1.4
* 路由改变销毁uploadify
 */
tree_v = "1.4";
define(["../modules/dirModule", "uploadify"], function (module) {
    module.directive('dirUploadify', ['scopeService', '$rootScope', function (scopeService, $rootScope) {
        var dirObj = {
            restrict: 'A',
            scope: {
                uploader: "=dirUploadify", //{files: [], progress:}
                url: "=", //上传路径(必填)
                settings: "=?settings", //配制对象
                returnValue: "=?",/*上传成功后返回值()*/

                onInit: "=",//uploadify初始化回调
                onSelect: "=",//添加文件回调
                onProgress: "=",//上传进度回调
                onSuccess: "=",//上传成功回调
                onError: "="//上传失败回调
            },
            replace: true,
            link: function (scope, element, attrs) {
                //路由改变的时候销毁
                $rootScope.$on('$routeChangeStart', function (scope, next, current) {
                    $(".uploadify").uploadify("destroy");
                });

                if (angular.isUndefined(scope.uploader) || scope.uploader == null) {
                    scope.uploader = {
                        files: [], //所选择的文件
                        failedFiles: [],//上传失败的文件
                        succeedFiles: [] //上传成功的文件
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
                var uploadifyId = "#" + id + "-uploadify";

                element.append("<div id='" + id + "-uploadify' style='display:none;'></div>");
                var uploaderContainer = $(uploadifyId);

                //uploadify options
                var options = {
                    swf: 'libs/uploadify/uploadify.swf',
                    buttonText: "",
                    url: ""
                };



                scope.$watch("settings", function () {
                    if (angular.isUndefined(scope.settings)) {
                        return;
                    }
                    //设置否否添加文件后自动上传
                    if (!angular.isUndefined(scope.settings.isAuto)) {
                        options.auto = scope.settings.isAuto;
                    }
                    //是否多选说
                    if (!angular.isUndefined(scope.settings.isMultiple)) {
                        options.multi = scope.settings.isMultiple;
                    }

                    //允许最大上传的文件个数
                    if (!angular.isUndefined(scope.settings.maxFileCount) && scope.settings.maxFileCount !== 0) {
                        options.uploadLimit = scope.settings.maxFileCount;
                    }

                    //允许上传的文件大小, uploadify 默认是以kb为单位
                    if (!angular.isUndefined(scope.settings.maxFileSize)) {
                        options.fileSizeLimit = scope.settings.maxFileSize * 1024;
                    }

                    //允许上传的文件类型(e.g: '*.gif; *.jpg; *.png',)
                    if (!angular.isUndefined(scope.settings.fileTypes)) {
                        options.fileTypeExts = scope.settings.fileTypes;
                    }
                });//end watch setting

                //////////////////////////////uploadify 事件回调/////////////////////////////////

                //初始化uploadify （将uplodify覆盖于指令所在元素）
                options.onInit = function () {
                    $(uploadifyId + "-queue").hide();
                    $(uploadifyId + "-button").hide();
                    if (!$(element).css("position") || $(element).css("position") == "static") {
                        $(element).css("position", "relative");
                    }
                    $(uploadifyId).css({ "position": "absolute", "top": "0", "left": "0", "bottom": "0", "right": "0", "height": "100%", "width": "100%" });
                    $(uploadifyId + " object").css({ "position": "absolute", "top": "0", "bottom": "0", "left": "0", "right": "0" })
                        .attr("height", $(uploadifyId).css("height"))
                        .attr("width", $(uploadifyId).css("width"))
                    /*   .attr("classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"); //一定要加，修复ie bug*/


                    if (scope.onInit != undefined) {
                        scope.onInit();
                    }
                };

                //选择文件触发该事件
                options.onSelect = function (file) {
                    if (!angular.isUndefined(scope.onSelect)) {
                        scope.onSelect(file);
                    }
                    if (!scope.uploader.files) {
                        scope.uploader.files = [];
                    }
                    scope.uploader.files.push({ name: file.name, size: Math.floor(file.size / 1024) + " KB", type: file.type, data: file });

                    scopeService.safeApply(scope);
                }

                //上传进度事件
                options.onUploadProgress = function (file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                    if (!angular.isUndefined(scope.onProgress)) {
                        scope.onProgress(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal);
                    }
                    scope.uploader.progress = Math.floor(bytesUploaded / bytesTotal * 100);
                    scopeService.safeApply(scope);
                };

                //上传成功触发该事件
                options.onUploadSuccess = function (file, data, response) {
                    var returnData = JSON.parse(data);
                    if (!angular.isUndefined(scope.onSuccess)) {
                        scope.onSuccess(file, returnData, scope.uploader);
                    }
                    scope.returnValue = returnData;

                    //上传成功文件数组
                    if (!scope.uploader.succeedFiles) {
                        scope.uploader.succeedFiles = [];
                    }
                    scope.uploader.succeedFiles.push({ name: file.name, url: returnData.url, size: Math.floor(file.size / 1024) + " KB", type: file.type, data: file });
                    scopeService.safeApply(scope);
                }

                //上传失败触发该事件
                options.onUploadError = function (file, errorCode, errorMsg, errorString) {
                    if (!angular.isUndefined(scope.onError)) {
                        scope.onError(file, errorCode, errorMsg, errorString);
                    }
                    //标记上传失败文件
                    for (var i = 0; i < scope.uploader.files.length; i++) {
                        var fileInQueue = scope.uploader.files[i];
                        if (fileInQueue.name === file.name) {
                            fileInQueue.isSuccess = false;
                        }
                    }

                    //上传失败数组
                    if (!scope.uploader.failedFiles) {
                        scope.uploader.failedFiles = [];
                    }
                    scope.uploader.failedFiles.push({ name: file.name, size: Math.floor(file.size / 1024) + " KB", type: file.type, data: file });
                    scopeService.safeApply(scope);
                }



                //检测上传路径
                scope.$watch("url", function () {
                    if (angular.isUndefined(scope.url)) {
                        return;
                    }
                    var url = "";
                    if (!angular.isUndefined(scope.url) && scope.url.indexOf("http://") == 0) {
                        url = scope.url;
                    } else {
                        url = $rootScope.config.baseUrl + scope.url;
                    }
                    angular.extend(options, { uploader: url });

                    //触发上传事件
                    try {
                        uploaderContainer.uploadify(options);
                    } catch (e) {

                    }
                });//end watch url


                ///////////////////////////////////暴露uploadify 的方法///////////////////////////
                scope.uploaderCtrl = {
                    uploadAll: function () {
                        //Upload specific files or all the files in the queue.
                        uploaderContainer.uploadify('upload', '*');
                    },
                    removeFile: function (file) {
                        /* Cancel a file from the queue or a file that is in progress.*/
                        uploaderContainer.uploadify('cancel', file.id);
                        for (var i = 0; i < scope.uploader.files.length; i++) {
                            var f = scope.uploader.files[i];
                            if (f.data == file) {
                                scope.uploader.files.remove(f);
                                scopeService.safeApply(scope);
                                return;
                            }
                        }
                    }
                };

                scope.$watch("uploader", function () {
                    if (scope.uploader) {
                        //获取Uploadify 的方法
                        scope.uploader.getCtrl = function () {
                            return scope.uploaderCtrl;
                        };
                    }
                }); //end watch

            } //end link
        };//end dirObj

        return dirObj;
    }]);//end dirUploadify

});//end define

