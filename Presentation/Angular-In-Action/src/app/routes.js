/*define(['app'], function (app) {
    return app.config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/home',
                {
                    templateUrl: 'js/controllers/home/home.html?nc=' + Math.random(),
                    controller: 'homeCtrl'
                })
                .otherwise(
                {
                    templateUrl: 'js/controllers/home/home.html?nc=' + Math.random(),
                    controller: 'homeCtrl'
                });
        }
    ]);
});*/

define(['app'], function (app) {
    return app.config([
        '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home',
                {
                    url: '/home',
                    templateUrl: 'js/controllers/home/home.html?nc=' + Math.random(),
                    controller: 'homeCtrl'
                });

            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/home");
        }
    ]);
});