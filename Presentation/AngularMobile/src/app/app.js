﻿var app = angular.module('mobileApp', [
    'ngRoute',
    'mobile-angular-ui',
    'mobile-angular-ui.gestures',
    //common module 
    'app',
    //-----component module
    'user'
]);

app.run(function ($transform) {
    window.$transform = $transform;
});

setTimeout(function asyncBootstrap() {
    if (window.angular.bootstrap) {
        angular.element(document.querySelector('.splash-screen')).addClass('flipOutY');
    }
    //---启动成功移除启动画面

}, 0);

//----路由配置
app.config(function ($routeProvider) {
    $routeProvider.otherwise(
        {
            redirectTo: 'users'
        });
});
