var app = angular.module('mobileApp', [
    'ngRoute',
/*    'ngAnimate',*/
    'jcs.angular-http-batch',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures',
    //common module 
    'app',
    'user'
    //-----component module

]);

//----系统常量配置
app.constant('appConfig', {
    apiServer: apiConfig.apiServer,
    apiBatchServer: apiConfig.apiBatchServer,
    payRoot: apiConfig.payRoot
});

app.run(function ($transform) {
    window.$transform = $transform;
});

setTimeout(function asyncBootstrap() {
    //---启动成功移除启动画面
    if (window.angular.bootstrap) {
        angular.element(document.querySelector('.splash-screen')).addClass('zoomOut');
        window.UI.init();
    }
}, 0);

//----app 配置
app.config(['$routeProvider', 'httpBatchConfigProvider', 'appConfig', function ($routeProvider, httpBatchConfigProvider, appConfig) {
    /*    //----批量请求
        httpBatchConfigProvider.setAllowedBatchEndpoint(
            appConfig.apiServer,
            appConfig.apiBatchServer,
            {
                maxBatchedRequestPerCall: 20,
                minimumBatchSize: 2 //The smallest number of individual calls allowed in a batch request
            }
        );*/

    //---路由
    $routeProvider
        .otherwise(
    {
        redirectTo: 'users'
    });
}]);
