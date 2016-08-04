/*
 * directive 1.0
 * 表单验证指令
 */
directive_v = "1.1";
define(['./baseModule'], function (module) {

    //----正则表达式
    module.constant('patterns', {
        idCardNo: /^[1-9](\d{5})(((19\d{2})|2\d{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8])))|(([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)(\d{3})([0-9]|X|x)$/,
        passport: /^([a-zA-Z]{5,17}|[a-zA-Z0-9]{5,17})$/,
        hkMacao: /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/,
        taiwan: /^([0-9]{8}|[0-9]{10})$/,
        studentNumber: /^[a-zA-Z0-9]{1,19}$/, //学籍号

        mobile: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
        phoneReg: /^[1][3-8]+\d{9}$/,
        email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9]+\.[A-Za-z]{2,4}$/,
        tel: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
        zhEn: /^[a-zA-Z\u4e00-\u9fa5]+$/, //中文英文
        zhEnChar: /^[a-zA-Z0-9@&-\.\u4e00-\u9fa5]+$/ //中文英文特殊字符(@&-.)
    });

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
