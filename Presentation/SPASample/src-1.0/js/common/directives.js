/*
 * directive 1.1
 * 增加a ,dirToggle
 * 增加dirDateTime 用于ng-model的时间格式化
  * 增加dirBool 用于ng-model的布尔值格式化
  * 增加dirSmartTextarea 用于模拟textarea输入框
 */
directive_v = "1.1";
define(['../modules/dirModule'], function (module) {

    //----rewrite a element
    module.directive("a", function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    element.on('click', function (event) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                    });
                }//end if
            }
        }
    });

    //----格式化时间
    module.directive('dirDateFormat', ['$filter', function ($filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                function formatValue(value) {
                    if (!value) {
                        return value;
                    }
                    return $filter('date')(value, attr['dirDateFormat']);
                }
                //ngModel.$parsers.push(fromUser);
                ngModel.$formatters.push(formatValue);
            }
        };
    }]);

    //----布尔值格式化
    module.directive('dirBool', ['$filter', function ($filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                function formatValue(input) {
                    if (input == null) {
                        return input;
                    }
                    var result = input ? "是" : "否";
                    return result;
                }
                //ngModel.$parsers.push(fromUser);
                ngModel.$formatters.push(formatValue);
            }
        };
    }]);

    //----toggle true/false
    module.directive('dirToggle', function () {
        return {
            restrict: 'A',
            scope: {
                toggle: "=dirToggle"
            },
            link: function (scope, element, attrs) {
                element.click(function () {
                    scope.$parent.$apply(function () {
                        scope.toggle = !scope.toggle;
                    });
                });
            }
        };
    });

    //----check 联动更改父级的isAllChecked的状态
    module.directive('dirToggleCheck', [function () {
        return {
            restrict: 'A',
            scope: {
                checked: "=dirToggleCheck"
            },
            link: function (scope, element, attrs) {
                scope.$watch("checked", function (newValue, oldValue) {
                    if (newValue == oldValue) {
                        return;
                    }
                }, true);
                element.click(function () {
                    scope.$parent.$apply(function () {
                        if (!angular.isUndefined(scope.$parent.isAllChecked) && scope.$parent.isAllChecked && scope.checked == false) {
                            scope.$parent.$parent.isAllChecked = false;
                        }
                    });
                });
            }
        };
    }]);

    //----全选Or全不选的时候
    module.directive('dirToggleCheckAll', function () {
        return {
            restrict: 'A',
            scope: {
                toggles: "=dirToggleCheckAll"
            },
            require: "?ngModel",
            link: function (scope, element, attrs, ngModel) {
                scope.$watch("toggles", function () {
                    if (!angular.isArray(scope.toggles) || ngModel == null) {
                        return;
                    }
                }, true);

                element.on("click", function () {
                    scope.$parent.$apply(function () {
                        for (var i = 0; i < scope.toggles.length; i++) {
                            scope.toggles[i].checked = ngModel.$viewValue;
                        }
                    });
                });
            }
        };
    });//end dir toggle all

    //----根据h5 contenteditable模拟textarea
    module.directive('dirSmartTextarea', function () {
        return {
            restrict: "A",
            replace: true,
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {

                //设置h5 contenteditable属性
                element.attr('contenteditable', 'true').css({
                    'border': '1px solid #cdcdcd',
                    'min-height': '100px',
                    'max-height': '400px',
                    'overflow': 'hidden',
                    'padding': '5px 10px 20px'
                });

                //将value值赋值给$viewValue
                element.bind('keyup', function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(element.html());
                    });
                });

                // $render函数负责将模型值同步到视图上
                ngModelCtrl.$render = function () {
                    element.html(ngModelCtrl.$viewValue);
                }

                ngModelCtrl.$setViewValue(element.html());
            }
        };
    });


});
