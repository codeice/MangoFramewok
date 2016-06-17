(function () {
    'use strict';
    var appCtrl = angular.module('app', ['app.services', 'app.directives', 'app.constants']);


    //----mainCtrl
    appCtrl.controller('mainCtrl', ['$rootScope', '$scope', 'uiKit', function ($rootScope, $scope, uiKit) {

        // Needed for the loading screen
        $rootScope.$on('$routeChangeStart', function (scope, next, current) {
            uiKit.blockUI();
        });

        $rootScope.$on('$routeChangeSuccess', function (scope, next, current) {
            uiKit.unblockUI();
            if (angular.isUndefined(next.$$route)) {
                return;
            }
            var currentPath = next.$$route.originalPath;
            if (currentPath == "/login" || currentPath == "/register") {
                uiKit.hideFooter();
            } else {
                uiKit.showFooter();
            }
        });
    }]);

})();