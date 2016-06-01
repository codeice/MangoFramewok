//-----umeditor
//* add disabled attr
directive_v = "1.1";
define(['../modules/dirModule', 'umeditor'], function (module) {
    module.directive('dirUmeditor', ['$rootScope', 'scopeService', function ($rootScope, scopeService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {

                //初始化umeditor容器id
                var id = 'angular-' + Math.floor((Math.random() * 999999999) + 1);
                if (attrs.id) {
                    id = attrs.id;
                } else {
                    attrs.id = id;
                }
                var isDisabled = attrs["umDisabled"];
                if (isDisabled == undefined || isDisabled == "false") {
                    isDisabled = false;
                } else {
                    isDisabled = true;
                }
                element.html("<div id='" + attrs.id + "'></div>");
                if (!ngModel) {
                    return;
                }
                var initContent;
                var editor;
                var editorIsReady;
                var ueObj = {
                    //----初始化umeditor
                    initEditor: function () {
                        editor = UM.getEditor(id);
                        editor.ready(function () {
                            editorIsReady = true;
                            if (initContent) {
                                editor.setContent(initContent);
                            }
                            if (isDisabled) {
                                editor.setDisabled('fullscreen');
                            }
                            editor.addListener('contentChange', function () {
                                /* 调用  ctrl.$setViewValue 才能改变 ngmodel 的值， 其他表单相关的也跟随着改变，如：验证 form.$invalid .etc*/
                                ueObj.setModelValue();
                            });
                            editor.addListener('afterSelectionChange', function () {
                                ueObj.setModelValue();
                            })

                        });//end um ready
                    },
                    //设置model value
                    setModelValue: function () {
                        /* 调用  ctrl.$setViewValue 才能改变 ngmodel 的值， 其他表单相关的也跟随着改变，如：验证 form.$invalid .etc*/
                        scopeService.safeApply(scope, function () {
                            var html = editor.getContent();
                            ngModel.$setViewValue(html);
                        });
                    },
                    //----设置editor内容
                    setContent: function (content) {
                        if (editor && editorIsReady) {
                            editor.setContent(content);
                        }
                    }

                }

                /** * 当Model改变值的时候为editor赋值*/
                ngModel.$render = function () {
                    initContent = ngModel.$isEmpty(ngModel.$viewValue) ? '' : ngModel.$viewValue;
                    ueObj.setContent(initContent);
                }

                /*            //----路由改变
                            $rootScope.$on('$routeChangeStart', function () {
                                editor && editor.destroy();
                            });*/

                ueObj.initEditor();
            }//end link


        }//end return
    }]);

});
