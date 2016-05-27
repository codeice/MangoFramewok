console.log("hello angular mobile");
var app = angular.module('app', [
    'ngRoute',
    'mobile-angular-ui',
     'mobile-angular-ui.gestures',

    //-----component module
    'user.service',
    'user.ctrl'
]);

app.run(["$transform", function ($transform) {
    window.$transform = $transform;
}]);


setTimeout(function asyncBootstrap() {
    angular.bootstrap(document, ["app"]);
    //---�𶯳ɹ��Ƴ��𶯻���
    // angular.element(document.querySelector('.splash-screen')).addClass('flipOutY');
}, 2000);

//----·������
app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            templateUrl: 'app/demo/user-list.html',
            controller: 'userCtrl',
            reloadOnSearch: false
        });
}]);
