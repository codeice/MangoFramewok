
define(['../../modules/ctrlModule'], function (module) {
    module.controller('signinCtrl', ['$scope', "$route", "$http", "$window", "$rootScope", "$location", "oauthService", function ($scope, $route, $http, $window, $rootScope, $location, oauthService) {

        var oauth = new oauthService();
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
        }

    }]);

});