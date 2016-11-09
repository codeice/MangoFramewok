/*
 * service 1.0
 * 增加scopeService,kservice,backgroundService
 */
service_v = "1.0";
define(['./baseModule', 'blockui'], function (module) {

    //scopeService
    module.service('scopeService', function () {
        return {
            safeApply: function ($scope, fn) {
                var phase = $scope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && typeof fn === 'function') {
                        fn();
                    }
                } else {
                    if (fn && typeof fn === 'function') {
                        $scope.$apply(fn);
                    } else {
                        $scope.$apply();
                    }
                }
            }
        };
    });

    //调用服务without blockUI
    module.factory('backgroundService', ["$http", "$rootScope", "oauthService", function ($http, $rootScope, oauthService) {
        var service = {
            "call": function (action, param, methodType) {

                if (oauthService.isAuthorized()) {
                    var result = [];
                    result.$promise = null;
                    var apihost = "";
                    if (action.indexOf('http') >= 0) {
                        apihost = action;
                    } else {
                        apihost = $rootScope.appConfig.apiServer + action;
                    }

                    if (methodType == undefined)
                        methodType = 'post';
                    methodType = methodType.toLowerCase();
                    $http.defaults.headers.common.Authorization = 'Bearer ' + oauthService.getAccessToken();

                    if (methodType == 'post') {
                        result.$promise = $http.post(apihost, param);
                    }
                    if (methodType === 'get') {
                        var queryParams = '?';
                        for (var k in param) {
                            queryParams += k + '=' + escape(param[k]) + '&';
                        }
                        if (queryParams === '?') {
                            queryParams = '';
                        }
                        result.$promise = $http.get(apihost + queryParams);
                    }
                    if (methodType === 'delete') {
                        result.$promise = $http['delete'](apihost, { params: param });
                    }
                    if (methodType === 'put') {
                        result.$promise = $http.put(apihost, param);
                    }
                    if (methodType === 'jsonp') {
                        apihost = apihost + "?callback=JSON_CALLBACK";
                        result.$promise = $http.jsonp(apihost, { params: param });
                    }
                    if (result.$promise != null) {
                        result.$promise.then(function (response) {
                            angular.extend(result, response.data);
                        }, function (response) {
                            if (response.status == 401) {
                                oauthService.goToLoginPage();
                            }
                        });
                        result.$promise.refresh = function (newParam) {
                            result.$promise.then(function () {
                                call(action, newParam).$promise.then(function (response) {
                                    angular.extend(result, response.data);
                                });
                            });
                        }
                    }
                    return result;
                } else {
                    //跳到认证页面
                    oauthService.goToLoginPage();
                }
            }
        };
        return service;
    }]);

    //api调用服务with blockUI
    module.factory('service', ["backgroundService", function (backgroundService) {
        var count = 0;
        var blocked = false;
        var service = {
            "call": function (action, param, methodType) {
                count++;
                if (!blocked) {
                    //                    setTimeout(function() {
                    //                        if (!blocked&&count>0) {
                    blocked = true;
                    $.blockUI({ message: '<h3><img src="images/loading.gif" /> 正在加载...</h3>' });
                    //                        }
                    //                    },300);
                }
                var result = backgroundService.call(action, param, methodType);
                result.$promise.finally(function () {
                    count--;
                    if (count <= 0) {
                        setTimeout(function () {
                            if (count <= 0) {
                                blocked = false;
                                $.unblockUI();
                            }
                        }, 300);
                    }
                });
                return result;
            }
        };
        return service;
    }]);

});
