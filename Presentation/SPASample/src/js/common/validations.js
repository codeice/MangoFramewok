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
                console.log(ngModelCtrl);
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

     //----验证手机号
    module.directive("mobile", ['patterns', function (patterns) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                var reg = new RegExp(patterns.mobile);
                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (reg.test(viewValue) || viewValue == undefined || viewValue === "") {
                        ngModelCtrl.$setValidity('mobile', true);
                        return viewValue;
                    } else {
                        ngModelCtrl.$setValidity('mobile', false);
                        return viewValue;
                    }
                });
            }
        };
    }]);

     //---验证身份证号
    module.directive("cardNumber", ['patterns', function (patterns) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                var reg = new RegExp(patterns.idCardNo);
                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (reg.test(viewValue) || viewValue == undefined || viewValue === "") {
                        ngModelCtrl.$setValidity('cardNumber', true);
                        return viewValue;
                    } else {
                        ngModelCtrl.$setValidity('cardNumber', false);
                        return viewValue;
                    }
                });
            }
        };
    }]);

});
