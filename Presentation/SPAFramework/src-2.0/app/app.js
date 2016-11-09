/*
 * app 1.1
 * 为了更好地模块复用，添加common，service,directive Module
* appConfig添加wsaf配置
 */
define(['OAuthClient', 'angular-batch', 'app/loadScripts'], function () {
    var app = angular.module('app', [
        'ui.router',
        'jcs.angular-http-batch',
        'ui.select',
        'ngSanitize',
        //核心模块定义
        'app.core',
        //账号密码模块
        'account',

        //业务模块（系统业务模块，以下为测试，拿到脚手架之后可删除）
        'file',
        'home',
        'demo',
        'test'

    ]);

    app.config([
        'httpBatchConfigProvider', function (httpBatchConfigProvider) {
            //register an endpoint that can accept a HTTP 1.1 batch request.
            httpBatchConfigProvider.setAllowedBatchEndpoint(
                config.appConfig.apiServer,
                config.appConfig.apiBatchServer,
                {
                    maxBatchedRequestPerCall: 20,
                    minimumBatchSize: 2 //The smallest number of individual calls allowed in a batch request
                });
        }
    ]);

    app.run([
        'httpBatcher', '$rootScope', function (httpBatcher, $rootScope) {
            //want to immediately send all pending request regardless of if the request quota or timeout limit has been reached.
            httpBatcher.flush();
            $rootScope.oauthConfig = config.oauthConfig;
            $rootScope.oauth = new OAuthClient(config.oauthConfig.authorizeEndpoint);
            $rootScope.appConfig = config.appConfig;
            $rootScope.goBack = function () {
                window.history.back();
            }
        }
    ]);

    //----默认路由配置
    return app.config([
    '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home',
            {
                url: '/home',
                templateUrl: 'app/home/home.html?nc=' + Math.random(),
                controller: 'homeCtrl'
            });

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/home");
    }
    ]);

    return app;
});
