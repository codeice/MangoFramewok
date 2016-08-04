/*
 * menu 1.3
* 如果不需要从wsaf读取menu,注释mainCtrl中 getUserMenus();调用的地方
*fix bug for undefined menu bug
 */
define(['angular-ui-router'], function () {
    var module = angular.module('app.menu', []);
    module.controller('menuCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

        //-----激活当前菜单 并设置面包屑对象
        function activeMenu(menus, parents) {
            if (!angular.isArray(menus)) {
                return;
            }
            for (var i = 0; i < menus.length; i++) {
                var menu = menus[i];
                menu.Active = false;
                menu.Open = false;
                var parent;
                if ($scope.currentState == menu.Url) {
                    menu.Active = true;
                    $scope.nav.currentTitle = menu.Name;
                    for (var j = 0; j < parents.length; j++) {
                        parent = parents[j];
                        parent.Active = true;
                        parent.Open = true;
                        $scope.nav.parents.push({ title: parent.Name, url: parent.Url, icon: parent.Icon });
                    }
                }
                else {
                    if (angular.isArray(menu.Submenus)) {
                        activeMenu(menu.Submenus, parents.concat(menu));
                    }
                }//end else 

            }//end for
        }

        $scope.$on("loadMenusDone", function () {
            activeMenu($rootScope.menus, []);
        });
        //end routeChange
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            if (angular.isUndefined(toState)) {
                return;
            }
            var stateChains = toState.name.split('.');
            $scope.currentState = stateChains[0];
            $scope.nav = {
                parents: [],
                currentTitle: ""
            };
            activeMenu($rootScope.menus, []);
        });

    }]);
});