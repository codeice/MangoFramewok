(function () {
    'use strict';
    var appCtrl = angular.module('app', ['app.constants', 'app.services', 'app.directives', 'app.filters', 'app.validations']);

    //----mainCtrl
    appCtrl.controller('mainCtrl', ['$rootScope', '$scope', 'uiKit', 'oauthService', function ($rootScope, $scope, uiKit, oauthService) {

        // Needed for the loading screen
        $rootScope.$on('$routeChangeStart', function (scope, next, current) {
            uiKit.blockUI();
        });

        $rootScope.$on('$routeChangeSuccess', function (scope, next, current) {
            uiKit.unblockUI();
            if (angular.isUndefined(next.$$route)) {
                return;
            }
            var footer = next.$$route.footer;
            var header = next.$$route.header;
            var auth = next.$$route.auth;
            if (!angular.isUndefined(footer) && !footer) {
                uiKit.hideFooter();
            } else {
                uiKit.showFooter();
            }

            if (!angular.isUndefined(header) && !header) {
                uiKit.hideHeader();
            } else {
                uiKit.showHeader();
            }

            //是否需要认证
            if (!angular.isUndefined(auth) && auth) {
                oauthService.getCurrentUser();
            }
        });

    }]);

})();