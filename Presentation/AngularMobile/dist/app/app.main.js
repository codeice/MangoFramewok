(function () {
    'use strict';
    var appCtrl = angular.module('app', ['app.services', 'app.directives', 'app.constants']);

    //----mainCtrl
    appCtrl.controller('mainCtrl', ['$rootScope', 'uiKit', function ($rootScope, uiKit) {

        // Needed for the loading screen
        $rootScope.$on('$routeChangeStart', function () {
            $rootScope.loading = true;
        });

        $rootScope.$on('$routeChangeSuccess', function () {
            $rootScope.loading = false;
        });
        $rootScope.loading = true;
    }]);

})();