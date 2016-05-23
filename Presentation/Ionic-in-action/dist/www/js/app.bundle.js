function demoServiceProxy(service) {

    //服务调用示例
    this.getAll = function () {
        return service.call("Competitions/QueryOptions", {}, "get");
    }

    //-----demo示例
    var list = [{
        id: 0,
        name: 'Ben Sparrow',
        email:'benSparrow@126.com',
        lastText: 'You on your way?',
        face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        email: 'MaxLynx@126.com',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
    }, {
        id: 2,
        name: 'Adam Bradleyson',
        email: 'Bradleyson@126.com',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
    }, {
        id: 3,
        name: 'Perry Governor',
        email: 'Governor@126.com',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
    }, {
        id: 4,
        name: 'Mike Harrington',
        email: 'Harrington@126.com',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
    }];

    this.getList = function () {
        return list;
    },

    this.remove = function (item) {
        list.splice(list.indexOf(item), 1);
    },

    this.getDetail = function (id) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return list[i];
            }
        }
        return null;
    }

}

//----list service
serviceModule.factory('demoService', ['service', function (service) {
    return new demoServiceProxy(service);
}]);
(function () {
    'use strict';

    //----用户列表
    ctrlModule.controller('userCtrl', ['$scope', 'demoService', '$ionicModal', function ($scope, demoService, $ionicModal) {
        /*        //----http service demo
                demoService.getAll().$promise.then(function (response) {
                    $scope.list = response.data.Data;
                    console.log("$scope.list=", $scope.list);
                });*/
        console.log("hello ionic");

        // Some fake testing data
        $scope.persons = demoService.getList();

        //读取缓存模板
        $ionicModal.fromTemplateUrl('modal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function (item) {
            $scope.user = angular.copy(item);
            $scope.modal.show();
        };

        //----删除
        $scope.remove = function (item) {
            demoService.remove(item);
        }

    }]);

    //----用户详情
    ctrlModule.controller('userDetailCtrl', ['$scope', '$stateParams', 'demoService', function ($scope, $stateParams, demoService) {
        var userId = $stateParams.userId;
        $scope.user = demoService.getDetail(userId);
    }]);

})();
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-05-06 16:41:43
 * @version $Id$
 */
//scopeService
service_v = '1.0.0';
serviceModule.service('scopeService', function () {
    return {
        safeApply: function ($scope, fn) {
            var phase = $scope.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && typeof fn === 'function') {
                    fn();
                }
            } else {
                if (fn && typeof fn === 'function') {
                    $scope.$apply(fn);
                } else {
                    $scope.$apply();
                }
            }
        }
    };
});

//-----UI工具服务
serviceModule.service('uiKit', ['$rootScope', '$q', '$ionicLoading', function ($rootScope, $q, $ionicLoading) {
    var blockCount = 0;
    var service = {
        blockUI: function () {
            blockCount++;
            $ionicLoading.show({
                template: '加载中',
                noBackdrop: false
            });
        },
        unblockUI: function () {
            blockCount--;
            if (blockCount <= 0) {
                $ionicLoading.hide();
            }
        },
    };
    return service;
}]);

serviceModule.factory('httpProxy', ['$http', function ($http) {
    var service = {
        call: function (route, param, methodType, userToken) {
            var result = [];
            result.$promise = null;
            var apihost = "";
            if (route.indexOf('http') >= 0) {
                apihost = route;
            } else {
                apihost = appConfig.apiServer + route;
            }

            //todo request with usertoken
            /*   //要求登录(token已参数形式传递 )
               if (userToken != null && userToken !== "") {
                   apihost = apihost + "?token=" + userToken;
               }
               //---token 通过header传递
               $http.defaults.headers.common.Authorization = 'Bearer ' + userToken;*/

            if (methodType == undefined)
                methodType = 'post';
            methodType = methodType.toLowerCase();
            if (methodType == 'post') {
                result.$promise = $http.post(apihost, param);
            }
            if (methodType === 'get') {
                var queryParams = '?';
                if (apihost.indexOf('?') >= 0) {
                    queryParams = "&";
                }
                var paramArray = [];
                for (var p in param) {
                    var paramStr = p + '=' + escape(param[p]);
                    paramArray.push(paramStr);
                }
                queryParams += paramArray.join('&');
                if (queryParams === '&' || queryParams === '?') {
                    queryParams = '';
                }
                result.$promise = $http.get(apihost + queryParams);
            }
            if (methodType === 'delete') {
                result.$promise = $http.delete(apihost, { params: param });
            }
            if (methodType === 'put') {
                result.$promise = $http.put(apihost, param);
            }
            if (methodType === 'jsonp') {
                apihost = apihost + "?callback=JSON_CALLBACK";
                result.$promise = $http.jsonp(apihost, { params: param });
            }
            if (result.$promise != null) {
                result.$promise.then(function (response) {
                    angular.extend(result, response.data);
                }, function (response) {
                    if (response.status == 401) {
                        /*  var m_oauthService = new oauthService();
                          m_oauthService.goToAuthorize();*/
                        //----todo goTologin
                    }
                });
                result.$promise.refresh = function (newParam) {
                    result.$promise.then(function () {
                        call(action, newParam).$promise.then(function (response) {
                            angular.extend(result, response.data);
                        });
                    });
                }
            }
            return result;
        }
    }
    return service;
}]);

//api http service
serviceModule.factory('service', ['httpProxy', 'uiKit', function (httpProxy, uiKit) {
    var count = 0;
    var blocked = false;
    var service = {
        //----带loading call
        "call": function (route, param, methodType) {
            count++;
            if (!blocked) {
                blocked = true;
                uiKit.blockUI();
            }
            var result = httpProxy.call(route, param, methodType);
            result.$promise.finally(function () {
                count--;
                if (count <= 0) {
                    setTimeout(function () {
                        if (count <= 0) {
                            blocked = false;
                            uiKit.unblockUI();
                        }
                    }, 300);
                }
            });
            return result;
        },

        //----无loading call
        'backgroundCall': function (route, param, methodType) {
            return httpProxy.call(route, param, methodType);
        }
    };
    return service;
}]);

/*dirModule.directive(
          "preLoading",
          function ($animate) {
              return ({
                  link: link,
                  restrict: "C"
              });
              function link(scope, element, attributes) {
                  $animate.leave(element.children().eq(1)).then(
                      function cleanupAfterAnimation() {
                          element.remove();
                          scope = element = attributes = null;
                      }
                  );
              }
          }
      );*/
//---配置文件
version_v = 1.0;
var appConfig = {
    apiServer: location.protocol + "//" + location.host + '/CE.WebApi/',
    apiBatchServer: this.apiServer + '/batch/'
}
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
'use strict';
var ctrlModule = angular.module('starter.controllers', ['ionic']);
var serviceModule = angular.module('starter.services', []);
var filterModule = angular.module('starter.filters', []);
var dirModule = angular.module('starter.directives', []);

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters', 'starter.directives']);

setTimeout(function asyncBootstrap() {
    angular.bootstrap(document, ["starter"]);
    //---�����ɹ��Ƴ���������
    angular.element(document.querySelector('.splash-screen')).addClass('flipOutY');
}, 2000);

app.run(function ($ionicPlatform) {
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
});

//----·������
app.config(function ($stateProvider, $urlRouterProvider) {

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
});

//# sourceMappingURL=app.bundle.js.map
