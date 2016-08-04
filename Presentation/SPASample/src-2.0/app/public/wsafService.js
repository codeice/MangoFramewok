define(['angular-ui-router'], function () {
    var module = angular.module('wsaf', []);
    function wsafServiceProxy(backgroundService, $rootScope) {

        //---获取用户菜单
        this.getUserMenus = function (userId) {
            return backgroundService.call($rootScope.appConfig.wsafApiServer + "Applications/" + $rootScope.appConfig.appId + "/Users/" + userId + "/Menus", {}, 'jsonp');
        }
    }

    module.factory('wsafService', ['backgroundService', '$rootScope', function (backgroundService, $rootScope) {
        return new wsafServiceProxy(backgroundService, $rootScope);
    }]);

});