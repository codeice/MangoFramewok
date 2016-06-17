/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-05-06 16:41:43
 * @version $Id$
 */
//scopeService
service_v = '1.0.0';
var serviceModule = angular.module('app.services', []);

serviceModule.service('scopeService', function () {
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

//-----UI工具服务
serviceModule.service('uiKit', ['$rootScope', '$q', '$ionicLoading', function ($rootScope, $q, $ionicLoading) {
    var blockCount = 0;
    var service = {
        blockUI: function () {
            blockCount++;
            $ionicLoading.show({
                template: '加载中',
                noBackdrop: false
            });
        },
        unblockUI: function () {
            blockCount--;
            if (blockCount <= 0) {
                $ionicLoading.hide();
            }
        },
    };
    return service;
}]);

serviceModule.factory('httpProxy', ['$http', function ($http) {
    var service = {
        call: function (route, param, methodType, userToken) {
            var result = [];
            result.$promise = null;
            var apihost = "";
            if (route.indexOf('http') >= 0) {
                apihost = route;
            } else {
                apihost = appConfig.apiServer + route;
            }

            //todo request with usertoken
            /*   //要求登录(token已参数形式传递 )
               if (userToken != null && userToken !== "") {
                   apihost = apihost + "?token=" + userToken;
               }
               //---token 通过header传递
               $http.defaults.headers.common.Authorization = 'Bearer ' + userToken;*/

            if (methodType == undefined)
                methodType = 'post';
            methodType = methodType.toLowerCase();
            if (methodType == 'post') {
                result.$promise = $http.post(apihost, param);
            }
            if (methodType === 'get') {
                var queryParams = '?';
                if (apihost.indexOf('?') >= 0) {
                    queryParams = "&";
                }
                var paramArray = [];
                for (var p in param) {
                    var paramStr = p + '=' + escape(param[p]);
                    paramArray.push(paramStr);
                }
                queryParams += paramArray.join('&');
                if (queryParams === '&' || queryParams === '?') {
                    queryParams = '';
                }
                result.$promise = $http.get(apihost + queryParams);
            }
            if (methodType === 'delete') {
                result.$promise = $http.delete(apihost, { params: param });
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
                        /*  var m_oauthService = new oauthService();
                          m_oauthService.goToAuthorize();*/
                        //----todo goTologin
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
        }
    }
    return service;
}]);

//api http service
serviceModule.factory('service', ['httpProxy', 'uiKit', function (httpProxy, uiKit) {
    var count = 0;
    var blocked = false;
    var service = {
        //----带loading call
        "call": function (route, param, methodType) {
            count++;
            if (!blocked) {
                blocked = true;
                uiKit.blockUI();
            }
            var result = httpProxy.call(route, param, methodType);
            result.$promise.finally(function () {
                count--;
                if (count <= 0) {
                    setTimeout(function () {
                        if (count <= 0) {
                            blocked = false;
                            uiKit.unblockUI();
                        }
                    }, 300);
                }
            });
            return result;
        },

        //----无loading call
        'backgroundCall': function (route, param, methodType) {
            return httpProxy.call(route, param, methodType);
        }
    };
    return service;
}]);
