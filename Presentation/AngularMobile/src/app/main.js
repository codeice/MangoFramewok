(function () {
    'use strict';
    var appCtrl = angular.module('app', ['app.services', 'app.directives']);

    //----mainCtrl
    appCtrl.controller('mainCtrl', ['$rootScope', function ($rootScope) {

        // Needed for the loading screen
        $rootScope.$on('$routeChangeStart', function () {
                $rootScope.loading = true;
        });

        $rootScope.$on('$routeChangeSuccess', function () {
                $rootScope.loading = false;
        });

    }]);

})();