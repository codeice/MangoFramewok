directives_v = '1.0.0';
(function () {
    var module = angular.module('app.directives', []);

    //----prevent a default click
    module.directive('a', function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    element.on('click', function (e) {
                        e.preventDefault();
                    });
                }
            }
        };
    });

    //----back
    module.directive('dirBack', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, elementt, attrs) {
                elementt.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]);

    //----ng-repeat 完后发射事件
    module.directive('onFinishRepeat', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attrs.onFinishRepeat);
                    });
                }
            }
        }//end return
    }]);


})();