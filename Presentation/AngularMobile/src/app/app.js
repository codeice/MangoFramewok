console.log("hello angular mobile");
var app = angular.module('app', [
    'ngRoute',
    'mobile-angular-ui',
     'mobile-angular-ui.gestures',

    //-----component module
    'user.service',
    'user.ctrl'
]);

app.run(function ($transform) {
    window.$transform = $transform;
});


setTimeout(function asyncBootstrap() {
    angular.bootstrap(document, ["app"]);
    //---启动成功移除启动画面
    // angular.element(document.querySelector('.splash-screen')).addClass('flipOutY');
}, 2000);

//----路由配置
app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            templateUrl: 'app/demo/user-list.html',
            controller: 'userCtrl',
            reloadOnSearch: false
        });
});
