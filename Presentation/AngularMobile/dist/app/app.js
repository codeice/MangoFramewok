var app = angular.module('mobileApp', [
    'ngRoute',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures',
    //common module 
    'app',
    //-----component module
    'user'
]);

//----系统常量配置
app.constant('appConfig', {
    apiServer: 'http://localhost/CE.WebApi/',
    apiBatchServer: this.apiServer + '/batch/'
});

app.run(["$transform", function ($transform) {
    window.$transform = $transform;
}]);

setTimeout(function asyncBootstrap() {
    //---启动成功移除启动画面
    if (window.angular.bootstrap) {
        angular.element(document.querySelector('.splash-screen')).addClass('flipOutY');
    }
}, 0);

//----路由配置
app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.otherwise(
        {
            redirectTo: 'users'
        });
}]);
