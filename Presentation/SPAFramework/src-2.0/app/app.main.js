/*
 * mainCtrl 1.4
* 如果不需要从wsaf读取menu
*login重构
*/
define(['./app.menu', './app.menuDatas', './base/loadBaseScripts', './directives/dirModule', './public/wsafService'], function () {

    //wsaf模块主要是登录后取菜单
    var module = angular.module('app.core', ['app.base', 'app.directives', 'app.menu', 'wsaf']);

    module.controller('mainCtrl', ['$scope', '$rootScope', '$location', '$window', 'oauthService', 'wsafService', function ($scope, $rootScope, $location, $window,oauthService, wsafService) {

        //---用户登录
        oauthService.login().$promise.then(function (response) {
            if (response.code == 200 && response.data) {
                var identityModel = response.data;
                $rootScope.currentUser = angular.fromJson(identityModel.UserInfo);
                //1. 读取本地菜单
                $rootScope.menus = menuData;
                $rootScope.$broadcast('loadMenusDone');
                //2.wsaf菜单
                //getUserMenus();
                redirectToUrl(identityModel.State);
            }
        });

        function redirectToUrl(state) {
            var hash = "";
            if (state !== undefined && state !== "") {
                hash = state;
            } else if ($window.location.hash !== "") {
                hash = $window.location.hash;
            } else {
                hash = $rootScope.appConfig.entryRoute;
            }
            $window.location = hash;
            showContent();
        }

        //显示隐藏内容页
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
                wsafService.getUserMenus($rootScope.currentUser.userId).$promise.then(function (response) {
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
            oauthService.logout();
        }

    }]);

});
