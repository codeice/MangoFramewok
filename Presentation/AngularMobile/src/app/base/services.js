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

//---current user service with localstorage
serviceModule.factory('oauthService', ['$location', '$q', '$http', 'appConfig', function ($location, $q, $http, appConfig) {

    var accessTokenKey = "accessToken";
    var refreshTokenKey = "refreshToken";
    var userInfoKey = "userInfo";
    var identityModel = {
        AccessToken: '',
        RefreshToken: '',
        UserInfo: ''
    };

    var service = {
        //----获取Token 对象
        getIdentityModel: function () {
            var accessTokenObj = storage.getItem(accessTokenKey);
            var refreshTokenObj = storage.getItem(refreshTokenKey);
            var userInfoObj = storage.getItem(userInfoKey);
            if (accessTokenObj != "") {
                identityModel.AccessToken = accessTokenObj.value;
            } else {
                identityModel.AccessToken = "";
            }
            if (refreshTokenObj != "") {
                identityModel.RefreshToken = refreshTokenObj.value;
            } else {
                identityModel.RefreshToken = "";
            }
            if (userInfoObj != "") {
                identityModel.UserInfo = userInfoObj.value;
            } else {
                identityModel.UserInfo = "";
            }

            return identityModel;
        },

        //----获取accesstoken
        getAccessToken: function () {
            return this.getIdentityModel().AccessToken;
        },

        //----获取UserInfo
        getUserInfo: function () {
            return this.getIdentityModel().UserInfo;
        },

        //----获取refreshToken
        getRefreshToken: function () {
            return this.getIdentityModel().RefreshToken;
        },

        //----保存Token(accesstoken 和refreshtoken的信息 用户信息)
        saveIdentityModel: function (tokenResult, userInfo, redirectUrl) {
            //---保存accessTokenInfo
            storage.setItem(accessTokenKey, tokenResult.AccessToken, tokenResult.ExpiresIn);
            //----保存refeshTokenInfo
            storage.setItem(refreshTokenKey, tokenResult.RefreshToken, tokenResult.RefreshTokenLifetime);

            //保存用户个人信息
            storage.setItem(userInfoKey, userInfo, tokenResult.ExpiresIn);

            if (redirectUrl == null || redirectUrl == "") {
                $location.path('/');
            } else {
                $location.path(redirectUrl);
            }
        },

        //----移除当前用户所有信息
        removeIdentityModel: function () {
            storage.removeItem(accessTokenKey);
            storage.removeItem(refreshTokenKey);
            storage.removeItem(userInfoKey);
        },

        //---到登录页面
        goToLoginPage: function () {
            $location.path('/mobileLogin/' + encodeURIComponent(window.location.hash.substring(1)));
        },

        //---跳转至登录
        goToAuthorize: function () {
            var result = [];
            if (this.getAccessToken() == "" && this.getRefreshToken() == "") {
                var defer = $q.defer();
                result.$promise = defer.promise;
                defer.resolve({ data: { Code: 10 } });
                service.goToLoginPage();
            } else if (this.getAccessToken() == "" && this.getRefreshToken() != "") {
                var refreshModel = {
                    RefreshToken: this.getRefreshToken()
                };
                //----todo 利用refresh token请求请的accessToken(根据各个系统采用的登录系统而异)
                result.$promise = $http.post(appConfig.oauthServer + "Delegation/refreshtoken", refreshModel);
                if (result.$promise != null) {
                    result.$promise.then(function (response) {
                        var apiResult = response.data;
                        if (apiResult.Code == 0) {
                            service.saveIdentityModel(apiResult.Data);
                        } else {
                            service.removeIdentityModel();
                        }
                    }, function () {
                        service.goToLoginPage();
                    });
                }
            }
            return result;
        }

    };
    return service;
}]);

//api http
serviceModule.factory('httpProxy', ['$http', 'appConfig', 'oauthService', 'uiKit', function ($http, appConfig, oauthService, uiKit) {
    var service = {
        call: function (route, param, methodType, accessToken) {
            var result = [];
            result.$promise = null;
            var apihost = "";
            if (route.indexOf('http') >= 0) {
                apihost = route;
            } else {
                if (appConfig.apiServer.substr(appConfig.apiServer.length - 1, 1) != '/') {
                    appConfig.apiServer = appConfig.apiServer + "/";
                }
                apihost = appConfig.apiServer + route;
            }

            //---token 通过header传递
            if(accessToken!=null&&accessToken!=undefined)
            {
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            }

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
                    /*               if (response.data.Code == 10) {
                                       oauthService.goToAuthorize();
                                   }*/
                    angular.extend(result, response.data);
                }, function (response) {
                    if (response.status == 401) {
                        oauthService.removeIdentityModel();
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
serviceModule.factory('service', ['$location', '$q', 'httpProxy', 'oauthService', 'uiKit', function ($location, $q, httpProxy, oauthService, uiKit) {
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
            if (oauthService.getAccessToken() != "") {
                return httpProxy.call(route, param, methodType, oauthService.getAccessToken());
            }
            else {
                var authorizedResult = oauthService.goToAuthorize();
                var result = [];
                var d = $q.defer();
                result.$promise = d.promise;
                if (authorizedResult.$promise != null) {
                    authorizedResult.$promise.then(function (response) {
                        if (response.data.Code == 0) {
                            var temp = httpProxy.call(route, param, methodType, oauthService.getAccessToken());
                            temp.$promise.then(function (apiResponse) {
                                angular.extend(result, apiResponse.data);
                                d.resolve({ data: apiResponse.data });
                            });
                        }
                    });
                }
                return result;
            }
        },

        //----授权并带loading效果
        authorizedLoadingCall: function (route, param, methodType) {
            if (oauthService.getAccessToken() != "") {
                return this.call(route, param, methodType, oauthService.getAccessToken());
            } else {
                var authorizedResult = oauthService.goToAuthorize();
                var result = [];
                var d = $q.defer();
                result.$promise = d.promise;
                if (authorizedResult.$promise != null) {
                    authorizedResult.$promise.then(function (response) {
                        if (response.data.Code == 0) {
                            var temp = this.call(route, param, methodType, oauthService.getAccessToken());
                            temp.$promise.then(function (apiResponse) {
                                angular.extend(result, apiResponse.data);
                                d.resolve({ data: apiResponse.data });
                            });
                        }
                    });
                }
                return result;
            }
        }
    };
    return service;
}]);

