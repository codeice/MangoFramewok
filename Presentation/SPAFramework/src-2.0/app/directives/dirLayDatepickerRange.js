/*
 * directive 1.2
 *
 * fix bug for edit ngModel
 */
define(['./dirModule', 'laydate'], function (module) {
    module.directive("dirLayDatepickerRange", ["$compile","$rootScope", "$timeout", "scopeService", '$filter', function ($compile,$rootScope, $timeout, scopeService, $filter) {
        return {
            restrict: 'A',
            templateUrl: 'app/directives/templates/dateRange.html',
            scope: {
                startName: '@',
                endName: '@',
                startModel: '=?startModel',
                endModel: '=?endModel',
            },
            controller: function ($scope, $element) {

            },
            link: function (scope, element, attrs, ngModel) {
               $timeout(function () {
                    scope.isValid = true;
                    var isDisabled = attrs["isDisabled"];
                    var ngDisabled = attrs["ngDisabled"];
                    if (isDisabled == undefined || isDisabled == "false" ) {
                        isDisabled = false;
                    }
                    else {
                        isDisabled = true;
                    }
                    if (ngDisabled == undefined || ngDisabled == "false") {
                        isDisabled = false;
                    }
                    else {
                        isDisabled = true;
                    }

                    var isRequired = attrs["isRequired"];
                    if (isRequired == undefined || isRequired == "false") {
                        isRequired = false;
                    } else {
                        isRequired = true;
                    }
                    var isShowTime = attrs["isShowTime"];
                    if (isShowTime == undefined || isShowTime == "false") {
                        isShowTime = false;
                    } else {
                        isShowTime = true;
                    }
                    scope.isRequired = isRequired;
                    scope.isDisabled = isDisabled;
                    scope.isValid = false;
                    var dateFormat = null;
                    var dateClass = "input-small";
                    if (attrs["dateFormat"]) {
                        dateFormat = attrs["dateFormat"];
                    } else {
                        dateFormat = "YYYY-MM-DD hh:mm:ss";
                    }
                    if (attrs["dateClass"]) {
                        dateClass = attrs["dateClass"];
                    }
                    scope.dateFormat = dateFormat;
                    scope.dateClass = dateClass;
                    var start = {
                        elem: '#' + scope.startName,
                        format: dateFormat,
                        //min: laydate.now(), //设定最小日期为当前日期
                        max: '2099-06-16 23:59:59', //最大日期
                        istime: isShowTime,
                        istoday: false,
                        isclear: false, //是否显示清空
                        issure: true,
                        choose: function (datas) {
                            scope.$parent.$apply(function () {
                                end.min = datas; //开始日选好后，重置结束日的最小日期
                                end.start = datas //将结束日的初始值设定为开始日
                                scope.startModel = datas;
                            });
                        }
                    };
                    var end = {
                        elem: '#' + scope.endName,
                        format: dateFormat,
                        //min: laydate.now(),
                        max: '2099-06-16 23:59:59',
                        istime: isShowTime,
                        istoday: false,
                        isclear: false, //是否显示清空
                        issure: true,
                        choose: function (datas) {
                            scope.$parent.$apply(function () {
                                start.max = datas; //结束日选好后，重置开始日的最大日期
                                scope.endModel = datas;
                            });
                        }
                    };

                    laydate(start);
                    laydate(end);

                    scope.$watch('startModel', function () {
                        if (!angular.isUndefined(scope.startModel)) {
                            scope.startModel = formatValue(scope.startModel);

                        }
                        //必填
                        if (scope.isRequired) {
                            if (!angular.isUndefined(scope.startModel) && !angular.isUndefined(scope.endModel)) {
                                scope.isValid = false;
                            } else {
                                scope.isValid = true;
                            }
                        }


                    }, true);

                    scope.$watch('endModel', function () {
                        if (!angular.isUndefined(scope.endModel)) {
                            scope.endModel = formatValue(scope.endModel);
                        }

                        //必填
                        if (scope.isRequired) {
                            if (!angular.isUndefined(scope.startModel) && !angular.isUndefined(scope.endModel)) {
                                scope.isValid = false;
                            }
                            else {
                                scope.isValid = true;
                            }
                        }
                    }, true);

                    function formatValue(input) {
                        if (!input) {
                            return input;
                        }
                        var value = $filter('date')(input, scope.dateFormat.replace('YYYY', 'yyyy').replace('DD', 'dd').replace('hh', 'HH'));

                        return value;
                    }

                }, 0);


            }
        };
    }]);

});