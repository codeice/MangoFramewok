/*
 * menu 1.3
* 如果不需要从wsaf读取menu,注释mainCtrl中 getUserMenus();调用的地方
*fix bug for undefined menu bug
 */
define(['./modules/ctrlModule', './common/oauthService'], function (module) {
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
                if ($scope.currentPath == menu.Url) {
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
                    } else {
                        //---匹配附属菜单
                        if (!angular.isUndefined(menu.AttachedMenus)) {
                            for (var j = 0; j < menu.AttachedMenus.length; j++) {
                                var attachedMenu = menu.AttachedMenus[j];
                                if ($scope.currentPath.indexOf(attachedMenu.Url) >= 0) {
                                    //set breadcrumb
                                    $scope.nav.currentTitle = attachedMenu.Name;
                                    $scope.nav.parents.push({ title: menu.Name, url: menu.Url, icon: menu.Icon });
                                    menu.Active = true;
                                    for (var k = 0; k < parents.length; k++) {
                                        parent = parents[k];
                                        parent.Active = true;
                                        parent.Open = true;
                                    }//end for k
                                }//end if  match url
                            }//end for j
                        }//end if 
                    }//end else inner
                }//end else 

            }//end for
        }


        $scope.$on("loadMenusDone", function () {
            activeMenu($rootScope.menus, []);
        });

        //----subscrib routeChangeStart event
        $scope.$on('$routeChangeStart', function (scope, next, current) {
            if (angular.isUndefined(next.$$route)) {
                return;
            }
            $scope.currentPath = "#" + next.$$route.originalPath;
            $scope.nav = {
                parents: [],
                currentTitle: ""
            };

            activeMenu($rootScope.menus, []);

        });
        //end routeChange

    }]);
});