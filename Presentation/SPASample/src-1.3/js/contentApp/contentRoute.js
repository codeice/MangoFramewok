define(['./contentApp'], function (app) {
    return app.config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/resetPassword',
                {
                    templateUrl: 'js/contentApp/controllers/resetPassword.html?nc=' + Math.random(),
                    controller: 'resetPasswordCtrl'
                })
                .when('/selectUser',
                {
                    templateUrl: 'js/contentApp/controllers/selectUser.html?nc=' + Math.random(),
                    controller: 'selectUserCtrl'
                });
        }
    ]);
});