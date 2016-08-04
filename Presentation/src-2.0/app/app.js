/*
 * app 1.1
 * 为了更好地模块复用，添加common，service,directive Module
* appConfig添加wsaf配置
 */
define(['ace', 'OAuthClient', 'angular-batch', 'app/loadScripts'], function () {
    var app = angular.module('app', ['ui.router', 'jcs.angular-http-batch', 'app.common', 'app.controllers', 'app.directives', 'app.services']);

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

    return app;
});
