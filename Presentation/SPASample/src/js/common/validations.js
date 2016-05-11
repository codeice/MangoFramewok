/*
 * directive 1.0
 * 表单验证指令
 */
directive_v = "1.1";
define(['../modules/dirModule'], function (module) {

    //----偶数验证指令
    module.directive('evenNumber', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (viewValue % 2 === 0) {
                        //ngmodel.$setValidity会影响到$invalid和$valid的值
                        ngModelCtrl.$setValidity('evenNumber', true);
                        return viewValue;
                    } else {
                        ngModelCtrl.$setValidity('evenNumber', false);
                        return viewValue;
                    }
                });
            }
        };
    }]);

});
