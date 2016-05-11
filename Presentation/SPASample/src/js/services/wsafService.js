define(['../modules/serviceModule'], function (module) {

    function wsafServiceProxy(service, backgroundService, httpJsonp, $rootScope) {

        //---获取用户菜单
        this.getUserMenus = function (userId) {
            return backgroundService.call($rootScope.appConfig.wsafApiServer + "Applications/" + $rootScope.appConfig.appId + "/Users/" + userId + "/Menus", {}, 'jsonp');
        }
    }

    module.factory('wsafService', ['service', 'backgroundService', 'httpJsonp', '$rootScope', function (service, backgroundService, httpJsonp, $rootScope) {
        return new wsafServiceProxy(service, backgroundService, httpJsonp, $rootScope);
    }]);

});