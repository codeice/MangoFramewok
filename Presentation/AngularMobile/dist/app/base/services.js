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
serviceModule.service('uiKit', ['$rootScope', '$q', function ($rootScope, $q) {
    var blockCount = 0;
    var service = {
        blockUI: function () {
            blockCount++;
            $('#loading-widget').addClass('widget-show');
        },
        unblockUI: function () {
            blockCount--;
            if (blockCount <= 0) {
                $('#loading-widget').removeClass('widget-show');
            }
        },
        message: function (msg) {
            $('#msg-widget .widget-body').html(msg);
            var $msgWidget = $('#msg-widget');
            $msgWidget.addClass('widget-show');
            setTimeout(function () {
                $msgWidget.removeClass('widget-show');
            }, 3000);
        },
        alert: function (msg, title) {
            if (title != undefined) {
                $('#alert-widget .widget-header .title').html(title);
            }
            $('#alert-widget .widget-body').html(msg);
            $('#alert-widget').addClass('widget-show');
        },
        confirm: function (msg, title) {
            if (title != undefined) {
                $('#confirm-widget .widget-header .title').html(title);
            }
            $('#confirm-widget .widget-body').html(msg);
            $('#confirm-widget').addClass('widget-show');
            $rootScope.confirmDefer = $q.defer();
            return $rootScope.confirmDefer.promise;
        },

        //显示底部的导航菜单
        showFooter: function () {
            angular.element(document.querySelector('.navbar-absolute-bottom')).removeClass('hide').addClass('show');
            angular.element(document.querySelector('body')).addClass('has-navbar-bottom');
        },
        //隐藏底部的导航菜单
        hideFooter: function () {
            angular.element(document.querySelector('.navbar-absolute-bottom')).removeClass('show').addClass('hide');
            angular.element(document.querySelector('body')).removeClass('has-navbar-bottom');
        },
        //隐藏top nav
        hideHeader: function () {
            angular.element(document.querySelector('.navbar-absolute-top')).removeClass('show').addClass('hide');
            angular.element(document.querySelector('body')).removeClass('has-navbar-top');
        },
        //显示top nav
        showHeader: function () {
            angular.element(document.querySelector('.navbar-absolute-top')).removeClass('hide').addClass('show');
            angular.element(document.querySelector('body')).addClass('has-navbar-top');
        },

    };
    return service;
}]);

//----current user service
serviceModule.factory('oauthService', ['$location', 'platform', function ($location, platform) {
    var service = {
        isAuthorized: function () {
            return cookieHelper.getCookie('token') == null || cookieHelper.getCookie('token') == "" ? false : true;
        },
        getToken: function () {
            return cookieHelper.getCookie('token');
        },
        saveToken: function (token, redirectUrl) {
            cookieHelper.setCookie('token', token, platform.tokenLifetime);
            if (redirectUrl == null || redirectUrl == "") {
                $location.path('/');
            } else {
                $location.path(redirectUrl);
            }
        },
        removeToken: function () {
            cookieHelper.clearCookie('token');
        },
        goToAuthorize: function () {
            if (!this.isAuthorized()) {
                $location.path('/login/' + encodeURIComponent(window.location.hash.substring(1)));
            }
        },
        getCurrentUser: function () {
            if (!this.isAuthorized()) {
                this.goToAuthorize();
            }
        }
    };
    return service;
}]);

//api http
serviceModule.factory('httpProxy', ['$http', 'appConfig', 'oauthService', 'uiKit', function ($http, appConfig, oauthService, uiKit) {
    var service = {
        call: function (route, param, methodType, userToken) {
            var result = [];
            result.$promise = null;
            var apihost = "";
            if (route.indexOf('http') >= 0) {
                apihost = route;
            } else {
                if (appConfig.apiServer.indexOf(appConfig.apiServer.length - 1) != '/') {
                    appConfig.apiServer = appConfig.apiServer + "/";
                }
                apihost = appConfig.apiServer + route;
            }

            //要求登录(token已参数形式传递 )
            if (userToken != null && userToken !== "") {
                apihost = apihost + "?token=" + userToken;
            }
            /*      //---token 通过header传递
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
                    if (response.data.Code == 10) {
                        oauthService.goToAuthorize();
                    }
                    angular.extend(result, response.data);
                }, function (response) {
                    if (response.status == 401) {
                        oauthService.goToAuthorize();
                    } else {
                        uiKit.message("数据服务出错！");
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
serviceModule.factory('service', ['$location', 'httpProxy', 'oauthService', 'uiKit', function ($location, httpProxy, oauthService, uiKit) {
    var count = 0;
    var blocked = false;
    var service = {
        //----带loading call
        call: function (route, param, methodType, token) {
            count++;
            if (!blocked) {
                blocked = true;
                uiKit.blockUI();
            }
            var result = httpProxy.call(route, param, methodType, token);
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
        backgroundCall: function (route, param, methodType) {
            return httpProxy.call(route, param, methodType);
        },

        //----授权后call
        authorizedCall: function (route, param, methodType) {
            if (oauthService.isAuthorized()) {
                return httpProxy.call(route, param, methodType, oauthService.getToken());
            } else {
                oauthService.goToAuthorize();
            }
        },

        //----授权并带loading效果
        authorizedLoadingCall: function (route, param, methodType) {
            if (oauthService.isAuthorized()) {
                return this.call(route, param, methodType, oauthService.getToken());
            } else {
                oauthService.goToAuthorize();
            }
        }
    };
    return service;
}]);

