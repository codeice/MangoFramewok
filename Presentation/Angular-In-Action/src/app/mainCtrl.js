/*
 * mainCtrl 1.3
* 如果不需要从wsaf读取menu
*/
define(['./modules/ctrlModule', './menuDatas', './common/oauthService'], function (module) {
    module.controller('mainCtrl', ['$scope', '$rootScope', '$window', 'oauthService', 'wsafService', function ($scope, $rootScope, $window, oauthService, wsafService) {

        var oauth = new oauthService();
        var userInfo = sessionStorage.getItem('user_info');
        //未登录
        if (!userInfo) {
            var currentUser = oauth.getCurrentUser();
            currentUser.then(function (result) {
                if (result && !angular.isUndefined(result.response) && result.response.state)
                    window.location.href = result.response.state;
                else
                    window.location.href = $rootScope.appConfig.entryRoute;
                window.location.reload();
            });
        } else {
            //1. 读取本地菜单
            $rootScope.menus = menuData;
            //2.wsaf菜单
            //getUserMenus();
            $rootScope.currentUser = angular.fromJson(sessionStorage.getItem('user_info'));
            showContent();
        }

        function showContent() {
            $('#content-body').removeClass('display-none');
            $('#loading-mask').addClass('display-none');
        }

        //----获取用户菜单
        function getUserMenus() {
            $rootScope.menus = [];
            $scope.userMenuKey = $rootScope.currentUser.userId + "_menus";
            var sessionMenuValues = sessionStorage.getItem($scope.userMenuKey);
            if (sessionMenuValues && sessionMenuValues != "undefined") {
                $rootScope.menus = angular.fromJson(sessionMenuValues);
            } else {
                if ($rootScope.currentUser.userId == undefined) {
                    bootbox.alert("当前登录用户不是wsaf用户，无法获取到用户菜单");
                    return;
                }
                menuService.getUserMenus($rootScope.currentUser.userId).$promise.then(function (response) {
                    $rootScope.menus = response.data;
                    sessionStorage.setItem($scope.userMenuKey, angular.toJson($scope.menus));
                    $rootScope.$broadcast('loadMenusDone');
                }, function (response) {
                    bootbox.alert("获取用户菜单失败");
                });
            }
        }

        //----注销
        $scope.logout = function () {
            oauth.logout();
        }

    }]);

});
