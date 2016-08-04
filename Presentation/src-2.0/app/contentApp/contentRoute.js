define(['./contentApp'], function (app) {
    return app.config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/resetPassword',
                {
                    templateUrl: 'app/contentApp/controllers/resetPassword.html?nc=' + Math.random(),
                    controller: 'resetPasswordCtrl'
                })
                .when('/selectUser',
                {
                    templateUrl: 'app/contentApp/controllers/selectUser.html?nc=' + Math.random(),
                    controller: 'selectUserCtrl'
                });
        }
    ]);
});