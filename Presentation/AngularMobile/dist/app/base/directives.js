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
    module.directive('onFinishRepeat', ["$timeout", function ($timeout) {
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

    module.directive('ngViewSlide', function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                var isGoToChildState, setSlide, slideClass, slideClasses, viewSelector;
               // viewSelector = '[ng-view]';
                slideClasses = ['slide-in-right', 'slide-out-right'];
                slideClass = '';
                setSlide = function (slide) {
                    slideClass = slide;
                    return element.removeClass(slideClasses.join(' ')).addClass(slideClass);
                   /* return elem.find(viewSelector).removeClass(slideClasses.join(' ')).addClass(slideClass);*/
                };
                scope.$on('$routeChangeSuccess', function (scope, next, current) {
                    setSlide('slide-in-right');
                });
                return scope.$on('$viewContentLoaded', function (evt, viewConfig) {
                    return element.removeClass(slideClasses.join(' ')).addClass(slideClass);
                });
            }
        }//end return
    });

})();