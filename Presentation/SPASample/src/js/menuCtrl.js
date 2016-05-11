/*
 * menu 1.2
* 如果不需要从wsaf读取menu
*1. 请取消wsafService的以来注入
*2. 将代码中wsaf读取menu的地方，换成menuData中的数据
 */
define(['./modules/ctrlModule', './menuDatas', './common/oauthService'], function (module) {
    module.controller('menuCtrl', ['$scope', '$rootScope', 'oauthService', 'wsafService', '$q', function ($scope, $rootScope, oauthService, wsafService, $q) {

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

        //1.menuData.js
        // $scope.menus = menuData;

        //2. wsafMenu获取菜单
        function getUserMenus() {
            $scope.userMenus = [];
            var currentUser = new oauthService().getCurrentUser();
            $scope.userMenus.$promise = currentUser.then(function () {
                $scope.userMenuKey = currentUser.userId + "_menus";
                var sessionMenuValues = sessionStorage.getItem($scope.userMenuKey);
                if (sessionMenuValues && sessionMenuValues != "undefined") {
                    $scope.userMenus = angular.fromJson(sessionMenuValues);
                    var defer = $q.defer();
                    $scope.userMenus.$promise = defer.promise;
                    defer.resolve({
                        data: $scope.userMenus
                    });
                    return $scope.userMenus;
                } else {
                    if (currentUser.userId == undefined) {
                        bootbox.alert("当前登录用户不是wsaf用户，无法获取到用户菜单");
                        return;
                    }
                    $scope.userMenus = wsafService.getUserMenus(currentUser.userId);
                    return $scope.userMenus;
                }
            });
        }

        getUserMenus();

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
            //1. wsaf menu
            $scope.userMenus.$promise.then(function (response) {
                $scope.menus = response.data;
                sessionStorage.setItem($scope.userMenuKey, angular.toJson($scope.menus));
                activeMenu($scope.menus, []);
            }, function (response) {
                bootbox.alert(response.data.Message);
            });

            //2. menuData.js 
            // activeMenu($scope.menus, []);
        });

    }]);
});