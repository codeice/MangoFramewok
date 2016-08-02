define(['app'], function (app) {
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
});