/*
 *oauthService 1.4
*登录重构
 */

define(['./baseModule'], function (module) {
    module.factory('oauthService', [
        "$http", "$window", "$rootScope", '$location', '$q', function ($http, $window, $rootScope, $location, $q) {
            var accessTokenKey = "accessToken";
            var idTokenKey = "idToken";
            var userInfoKey = 'userInfo';
            //----身份信息
            var identityModel = {
                AccessToken: '',
                ExpiresIn: '',
                IdToken: '',
                IdTokenExpiresIn: '',
                UserInfo: '',
                UserInfoExpiresIn: ''
            };

            var service = {

                //----构造IdentityModel
                initIdentityModel: function (accToken, expiresIn, idToken, idTokenExpires, userInfo, userInfoExpiresIn) {
                    identityModel = {
                        AccessToken: accToken,
                        ExpiresIn: expiresIn,
                        IdToken: idToken,
                        IdTokenExpiresIn: idTokenExpires,
                        UserInfo: userInfo,
                        UserInfoExpiresIn: userInfoExpiresIn
                    };
                },

                //-----获取身份信息
                getIdentityInfo: function () {
                    var accessTokenObj = storage.getItem(accessTokenKey);
                    if (accessTokenObj != "") {
                        identityModel.AccessToken = accessTokenObj.value;
                    } else {
                        identityModel.AccessToken = "";
                    }
                    var idTokenObj = storage.getItem(idTokenKey);
                    if (idTokenObj != "") {
                        identityModel.IdToken = idTokenObj.value;
                    } else {
                        identityModel.IdToken = "";
                    }

                    var userInfoObj = storage.getItem(userInfoKey);
                    if (userInfoObj != "") {
                        identityModel.UserInfo = userInfoObj.value;
                    } else {
                        identityModel.UserInfo = "";
                    }
                    return identityModel;
                },

                //---获取accessToken
                getAccessToken: function () {
                    return service.getIdentityInfo().AccessToken;
                },

                //-----保存身份信息
                saveIdentityInfo: function () {

                    //---保存accessTokenInfo
                    storage.saveItem(accessTokenKey, identityModel.AccessToken, identityModel.ExpiresIn);
                    //----保存IdTokenInfo
                    storage.saveItem(idTokenKey, identityModel.IdToken, identityModel.IdTokenExpiresIn);
                    //-----保存用户信息
                    storage.saveItem(userInfoKey, identityModel.UserInfo, identityModel.UserInfoExpiresIn);
                },

                //----移除身份信息
                removeIdentityInfo: function () {
                    storage.removeItem(accessTokenKey);
                    storage.removeItem(idTokenKey);
                    storage.removeItem(userInfoKey);
                    if ($rootScope.currentUser && $rootScope.currentUser.userId != undefined) {
                        sessionStorage.removeItem($rootScope.currentUser.userId + '_menus');
                    }
                },

                //----是否已登录
                isAuthorized: function () {
                    identityModel = this.getIdentityInfo();
                    if (identityModel.AccessToken == "") {
                        return false;
                    } else {
                        return true;
                    }
                },

                //----跳转至登录页面
                goToLoginPage: function () {
                    service.removeIdentityInfo();
                    var req = $rootScope.oauth.createImplicitFlowRequest(
                       $rootScope.oauthConfig.clientId,
                       $rootScope.oauthConfig.redirectUri,
                       'openid profile idmgr wsaf_infos wsaf_accesses',
                       'id_token token');
                    //跳转到认证登录页面
                    $window.location = req.url;
                },

                //-----解析认证中心redirect回来的token信息
                parseHashAsTokenInfo: function () {
                    var hash = $location.path().substring(1);
                    var tokenObj = $rootScope.oauth.parseResult(hash);
                    return tokenObj;
                },

                //----证书验证
                verifyCert: function (tokenResult) {
                    var result = {};
                    if (tokenResult && tokenResult.id_token) {
                        var jwsUri = $rootScope.oauthConfig.jwksUri + "?nc=" + Math.random();
                        result.$promise = $http.get(jwsUri).then(function (response) {
                            var cert = response.data.keys[0].x5c[0];
                            var jws = new KJUR.jws.JWS();
                            return jws.verifyJWSByPemX509Cert(tokenResult.id_token, cert);
                        });
                    } else {
                        var defer = $q.defer();
                        result.$promise = defer.promise;
                        defer.resolve({ data: false });
                    }
                    return result;
                },

                //----获取用户信息
                getUserInfo: function (tokenResult) {
                    var result = {};
                    var userInfoUrl = $rootScope.oauthConfig.userInfoUri + "?nc=" + Math.random();
                    $http.defaults.headers.common.Authorization = 'Bearer ' + tokenResult.access_token;
                    result.$promise = $http.get(userInfoUrl).then(function (response) {
                        var userInfo = response.data;
                        var jws = new KJUR.jws.JWS();
                        jws.parseJWS(tokenResult.access_token);
                        var accTokenInfo = $.parseJSON(jws.parsedJWS.payloadS);
                        var accExpires = accTokenInfo.exp * 1000;
                        jws.parseJWS(tokenResult.id_token);
                        var idTokenInfo = $.parseJSON(jws.parsedJWS.payloadS);
                        var idTokenExpires = idTokenInfo.exp * 1000;
                        //---保存用户信息
                        service.initIdentityModel(tokenResult.access_token, accExpires, tokenResult.id_token, idTokenExpires, userInfo, accExpires);
                        service.saveIdentityInfo();
                        return service.getIdentityInfo();
                    }, function () {
                        return null;
                    });

                    return result;
                },

                //---登录
                login: function () {
                    var result = [];
                    var defer = $q.defer();
                    result.$promise = defer.promise;
                    var tokenResult = this.parseHashAsTokenInfo();
                    if (this.isAuthorized()) {
                        var redirectUrl = '';
                        if (tokenResult != null) {
                            redirectUrl = tokenResult.state;
                        }
                        var obj = angular.extend({ state: redirectUrl }, service.getIdentityInfo());
                        defer.resolve({ code: 200, data: obj });
                    } else {
                        if (tokenResult && tokenResult.access_token) {
                            //----验证证书
                            this.verifyCert(tokenResult).$promise.then(function (isCertValid) {
                                if (isCertValid) {
                                    service.getUserInfo(tokenResult).$promise.then(function (response) {
                                        defer.resolve({ code: 200, data: response });
                                    });
                                } else {
                                    defer.resolve({ code: 401 });
                                    service.goToLoginPage();
                                }
                            });
                        } else {
                            defer.resolve({ code: 401 });
                            //----否则跳转至登录页面
                            this.goToLoginPage();
                        }
                    }
                    return result;
                },

                //----注销
                logout: function () {
                    identityModel = service.getIdentityInfo();
                    if (identityModel && identityModel.IdToken) {
                        var idToken = identityModel.IdToken;
                        var logoutEndpoint = $rootScope.oauthConfig.logoutEndpoint + "?id_token_hint=" + idToken + "&post_logout_redirect_uri=" + $rootScope.appConfig.baseUrl;
                        service.removeIdentityInfo();
                        $window.location = logoutEndpoint;
                    } else {
                        console.error("IdToken 丢失无法注销");
                    }
                }
            };

            return service;
        } //end factory
    ]);

});