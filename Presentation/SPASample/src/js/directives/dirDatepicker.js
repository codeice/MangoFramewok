/*
 * directive 1.1
 *增加显示年视图，年月视图
 */
define(['../modules/dirModule', 'datepickerZh'], function (module) {
    module.directive("dirDatepicker", ["$compile", "scopeService", '$filter', function ($compile, scopeService, $filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            replace: true,
            link: function (scope, element, attrs, ngModel) {
                var dateFormat = null;
                if (attrs["dirDatepicker"]) {
                    dateFormat = attrs["dirDatepicker"].replace("M", "m").replace("M", "m");
                } else {
                    dateFormat = "yyyy-mm-dd";
                }
                var option = {
                    autoclose: true,
                    language: 'zh-CN',
                    format: dateFormat
                };

                ///根据格式来设置dp的视图模式的minViewModel(0=day,1=month,2=year)
                var minViewMode = 0; //
                if (dateFormat === 'yyyy') {
                    //只显示年
                    minViewMode = 2;
                } else if (dateFormat.indexOf('yyyy') >= 0 && dateFormat.indexOf('mm') >= 0 && dateFormat.indexOf('dd') < 0) {
                    //显示年月
                    minViewMode = 1;
                } else {
                    //年月日
                    minViewMode = 0;
                }
                option.minViewMode = minViewMode;
                element.datepicker(option);
                element.off('blur').on('blur', function () {
                    scopeService.safeApply(scope, function () {
                        var date = null;
                        if (minViewMode === 2) {
                            date = element.datepicker("getYear");
                        } else if (minViewMode === 1) {
                            date = element.datepicker("getMonth");
                        } else {
                            date = element.datepicker("getDate");
                        }
                        var value = $filter('date')(date, attrs["dirDatepicker"]);
                        ngModel.$setViewValue(value);
                    });
                });

                function formatValue(input) {
                    if (!input) {
                        return input;
                    }
                    if (minViewMode === 2) {
                        input = Date.parse(input + "");
                    }
                    var value = $filter('date')(input, attrs["dirDatepicker"]);
                    return value;
                }

                ngModel.$formatters.push(formatValue);
            }
        };
    }]);

});
