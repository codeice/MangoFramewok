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

})();