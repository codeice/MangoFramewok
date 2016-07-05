validations_v = '1.0.0';

(function () {
    var module = angular.module('app.validations', []);

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

})();