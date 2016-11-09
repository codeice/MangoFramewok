/*
 * directive 1.2
 *增加显示年视图，年月视图
 * fix bug for edit ngModel
 */
define(['./dirModule', 'laydate'], function (module) { 
    module.directive("dirLayDatepicker", ["$compile", "scopeService", '$filter', function ($compile, scopeService, $filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            replace: true,
            link: function (scope, element, attrs, ngModel) {
                    var dateFormat = null;
                    if (attrs["dirLayDatepicker"]) {
                        dateFormat = attrs["dirLayDatepicker"];
                    } else {
                        dateFormat = "YYYY-MM-DD";
                    }
                    var inputId = attrs["id"];
                    var option = {
                        elem: '#' + inputId,
                        event: 'focus',
                        min: laydate.now(), //设定最小日期为当前日期
                        istime: true,
                        format: dateFormat, //日期格式
                        choose: function(dates){ //选择好日期的回调
                            scopeService.safeApply(scope, function () {
                                ngModel.$setViewValue(dates);
                            });

                        }
                    }
                    setTimeout(function () {
                        laydate(option);
                    },1000);
 
                    function formatValue(input) {
                        if (!input) {
                            return input;
                        }
                        var value = $filter('date')(input, 'yyyy-MM-dd');
                        return value;
                    }

                    ngModel.$formatters.push(formatValue);
                }
        };
    }]);

});