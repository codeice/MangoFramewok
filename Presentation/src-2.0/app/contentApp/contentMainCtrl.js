/*
 * mainCtrl 1.3
* 如果不需要从wsaf读取menu
*/
define(['./contentModule', '../base/oauthService'], function (module) {
    module.controller('contentMainCtrl', ['$scope', '$rootScope', '$window', 'oauthService', function ($scope, $rootScope, $window, oauthService) {
        /*        var oauth = new oauthService();
                $rootScope.currentUser = angular.fromJson(sessionStorage.getItem('user_info'));
                if ($rootScope.currentUser == null) {
                    var currentUser = oauth.getCurrentUser();
                    currentUser.then(function (result) {
                        if (!angular.isUndefined(result.response) && result.response.state)
                            $window.location = result.response.state;
                        else
                            $window.location = $rootScope.appConfig.entryRoute;
                    });
                }
        
                //----注销
                $scope.logout = function () {
                    oauth.logout();
                }*/

    }]);
});