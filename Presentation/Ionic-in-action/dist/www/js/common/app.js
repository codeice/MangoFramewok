// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
'use strict';
/*
var ctrlModule = angular.module('starter.controllers', ['ionic']);
var serviceModule = angular.module('starter.services', []);
var filterModule = angular.module('starter.filters', []);
var dirModule = angular.module('starter.directives', []);
*/

var app = angular.module('starter', [
    'ionic',
    'starter.services',
    'starter.directives',

    //-----component module
    'user.service',
    'user.ctrl'
]);

setTimeout(function asyncBootstrap() {
    angular.bootstrap(document, ["starter"]);
    //---�𶯳ɹ��Ƴ��𶯻���
    angular.element(document.querySelector('.splash-screen')).addClass('flipOutY');
}, 2000);

app.run(["$ionicPlatform", function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
}]);

//----·������
app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('tab', {
            url: '/tab',
            //ֻ�ܹ����̳У����ܹ�ֱ���л�����״̬
            abstract: true,
            templateUrl: 'js/navbar/tabs.html'
        })
        //----userҳ��
        .state('tab.user', {
            url: '/users',
            views: {
                'tab-users': {
                    templateUrl: 'js/demo/user-list.html',
                    controller: 'userCtrl'
                }
            }
        })
        .state('tab.user-detail', {
            url: '/users/:userId',
            views: {
                'tab-users': {
                    templateUrl: 'js/demo/user-detail.html',
                    controller: 'userDetailCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise("/tab/users");
}]);
