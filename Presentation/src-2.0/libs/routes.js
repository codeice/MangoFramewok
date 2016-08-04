define(['app'], function (app) {
    return app.config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/home',
                {
                    templateUrl: 'app/controllers/home/home.html?nc=' + Math.random(),
                    controller: 'homeCtrl'
                })
                .otherwise(
                {
                    templateUrl: 'app/controllers/account/signin.html?nc=' + Math.random(),
                    controller: 'signinCtrl'
                });
        }
    ]);
});