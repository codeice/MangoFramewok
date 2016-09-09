(function () {
    'use strict';
    var module = angular.module('account', ['account.service']);

    //----路由配置
    module.config(['$routeProvider',function ($routeProvider) {
        $routeProvider
            .when('/mobileLogin',
                {
                    templateUrl: 'app/account/mobile-login.html',
                    controller: 'mobileLoginCtrl',
                    reloadOnSearch: false,
                    footer: false
                })
            .when('/mobileLogin/:redirectUrl',
                {
                    templateUrl: 'app/account/mobile-login.html',
                    controller: 'mobileLoginCtrl',
                    reloadOnSearch: false,
                    footer: false
                })
            .when('/vcodeLogin',
                {
                    templateUrl: 'app/account/vcode-login.html',
                    controller: 'vcodeLoginCtrl',
                    reloadOnSearch: false,
                    footer: false
                })
            .when('/vcodeLogin/:redirectUrl',
                {
                    templateUrl: 'app/account/vcode-login.html',
                    controller: 'vcodeLoginCtrl',
                    reloadOnSearch: false,
                    footer: false
                })
            .when('/mobileRegister', {
                templateUrl: 'app/account/mobile-register.html',
                controller: 'registerFormCtrl',
                reloadOnSearch: false,
                footer: false
            })
            .when('/mobile/:mobile/:pwd/register', {
                templateUrl: 'app/account/verification-code.html',
                controller: 'mobileRegisterCtrl',
                reloadOnSearch: false,
                footer: false
            })
            //忘记密码
            .when('/forgetPwd', {
                templateUrl: 'app/account/forget-password.html',
                controller: 'forgetPwdCtrl',
                reloadOnSearch: false,
                footer: false
            })
        ;
    }]);

    //----手机号+密码登录
    module.controller('mobileLoginCtrl', ['$scope', '$location', '$routeParams', '$timeout', 'oauthService', 'accountService', 'uiKit', 'platform', function ($scope, $location, $routeParams, $timeout, oauthService, accountService, uiKit, platform) {

        var redirectUrl = decodeURIComponent($routeParams.redirectUrl);

        $scope.loginModel = {
            IdentityKey: "",
            Password: "",
            VerificationCode: null,
            From: platform.from,
            GraphicCode: null
        };


        $scope.isShowSaveBtn = true;// 登录 & 登录中...

        $scope.toggleShow = function () {
            $scope.isReadable = !$scope.isReadable;
        };

        //----手机号登录
        $scope.mobileLogin = function () {
            $scope.isSubmitted = true;
            if ($scope.form.$invalid) {
                return false;
            }
            $scope.isShowSaveBtn = false;
            accountService.mobileLogin($scope.loginModel).$promise.then(function (response) {
                if (response.data.Code == 0) {
                    //oauthService.saveTokenInfo(result.Data);
                    //获取用户信息
                    accountService.getCurrentUser(response.data.Data.AccessToken).$promise.then(function (result) {
                        if (result.data.Code == 0) {
                            $scope.user = result.data.Data;
                            oauthService.saveIdentityModel(response.data.Data, result.data.Data, redirectUrl);
                        }
                    });
                } else {
                    uiKit.alert(response.data.Message);
                }
                $scope.isShowSaveBtn = true;
            });
        };

    }]);

    //----手机号+验证码登录
    module.controller('vcodeLoginCtrl', ['$scope', '$location', '$routeParams', '$timeout', 'oauthService', 'accountService', 'uiKit', 'smsEvent', 'platform', function ($scope, $location, $routeParams, $timeout, oauthService, accountService, uiKit, smsEvent, platform) {

        var redirectUrl = decodeURIComponent($routeParams.redirectUrl);

        $scope.loginModel = {
            Mobile: "",
            VerificationCode: "",
            From: platform.from
        };


        $scope.btnText = "发送验证码";
        $scope.isEnableSend = true;

        //----发送短信验证码
        $scope.sendSMS = function () {
            var smsModel = {
                CellNumber: $scope.loginModel.Mobile,
                Event: smsEvent.sendLoginVCode
            };
            accountService.sendSMS(smsModel).$promise.then(function (response) {
                var result = response.data;
                if (result.Code == 0) {
                    $scope.vCodeLifetime = result.Data;
                    $scope.isEnableSend = false;
                    countDown();
                } else if (result.Code == 40) {
                    uiKit.message("网络繁忙，请稍后再试~");
                } else {
                    uiKit.message(result.Message);
                }
            });
        };

        //----倒计时
        function countDown() {
            var intevalId = setInterval(function () {
                if ($scope.vCodeLifetime < 0) {
                    clearInterval(intevalId);
                    $scope.isEnableSend = true;
                    $timeout(function () {
                        $scope.btnText = "发送短信验证码";
                    }, 0);
                } else {
                    $scope.vCodeLifetime--;
                    $timeout(function () {
                        $scope.btnText = "重新发送(" + $scope.vCodeLifetime + ")";
                    }, 0);
                }
            }, 1000);
        }

        //----验证码登录
        $scope.vCodeLogin = function () {
            $scope.isSubmitted = true;
            if ($scope.form.$invalid) {
                return false;
            }
            accountService.verificationCodeLogin($scope.loginModel).$promise.then(function (response) {
                if (response.data.Code == 0) {
                    //获取用户信息
                    accountService.getCurrentUser(response.data.Data.AccessToken).$promise.then(function (result) {
                        if (result.data.Code == 0) {
                            $scope.user = result.data.Data;
                            oauthService.saveIdentityModel(response.data.Data, result.data.Data, redirectUrl);
                        }
                    });
                } else {
                    uiKit.alert(response.data.Message);
                }
            });
        };

    }]);

    //----用户手机号注册表单
    module.controller('registerFormCtrl', ['$scope', '$location', 'uiKit', 'smsEvent', 'accountService', function ($scope, $location, uiKit, smsEvent, accountService) {

        //----验证码登录模型
        $scope.model = {
            Mobile: '',
            Password: ''
        };

        //----密码是否可见
        $scope.isReadable = false;
        $scope.toggleShow = function () {
            $scope.isReadable = !$scope.isReadable;
        };

        //----发送短信验证码
        $scope.sendSMS = function () {
            $scope.isSubmitted = true;
            if ($scope.form.$invalid) {
                return false;
            }
            var smsModel = {
                CellNumber: $scope.model.Mobile,
                Event: smsEvent.sendRegisterVCode
            };
            accountService.sendSMS(smsModel).$promise.then(function (response) {
                var result = response.data;
                if (result.Code == 0) {
                    $scope.vCodeLifetime = result.Data;
                    $location.path('/mobile/' + $scope.model.Mobile + '/' + $scope.model.Password + '/register');
                } else if (result.Code == 40) {
                    uiKit.message("网络繁忙，请稍后再试~");
                } else {
                    uiKit.message(result.Message);
                }
            });
        };
    }]);

    //----手机注册
    module.controller('mobileRegisterCtrl', ['$scope', '$location', '$timeout', '$routeParams', 'oauthService', 'accountService', 'uiKit', 'smsEvent', function ($scope, $location, $timeout, $routeParams, oauthService, accountService, uiKit, smsEvent) {
        //----验证码登录模型
        $scope.model = {
            Mobile: $routeParams.mobile,
            Password: $routeParams.pwd,
            VerificationCode: ''
        };

        //----手机号注册
        $scope.register = function () {
            $scope.isSubmitted = true;
            if ($scope.form.$invalid) {
                return false;
            }
            accountService.mobileRegister($scope.model).$promise.then(function (response) {
                if (response.data.Code == 0) {
                    uiKit.message("恭喜您，您已成为赛圈儿用户！");

                    //获取用户信息
                    accountService.getCurrentUser(response.data.Data.AccessToken).$promise.then(function (result) {
                        if (result.data.Code == 0) {
                            $scope.user = result.data.Data;
                            oauthService.saveIdentityModel(response.data.Data, result.data.Data);
                        }
                    });
                } else {
                    uiKit.message(response.Message);
                }
            });
        };

    }]);

    //----忘记密码(发送重置密码)
    module.controller('forgetPwdCtrl', ['$scope', '$location', '$timeout', '$routeParams', 'oauthService', 'accountService', 'uiKit', 'smsEvent', function ($scope, $location, $timeout, $routeParams, oauthService, accountService, uiKit, smsEvent) {

        $scope.ResetPasswordModel = {
            Mobile: "",
            VerificationCode: ""
        };


        $scope.btnText = "发送验证码";
        $scope.isEnableSend = true;

        //----发送短信验证码
        $scope.sendSMS = function () {
            var smsModel = {
                CellNumber: $scope.ResetPasswordModel.Mobile,
                Event: smsEvent.sendResetPwdVCode
            };
            accountService.sendSMS(smsModel).$promise.then(function (response) {
                var result = response.data;
                if (result.Code == 0) {
                    $scope.vCodeLifetime = result.Data;
                    $scope.isEnableSend = false;
                    countDown();
                } else if (result.Code == 40) {
                    uiKit.message("网络繁忙，请稍后再试~");
                } else {
                    uiKit.message(result.Message);
                }
            });
        };

        //----倒计时
        function countDown() {
            var intevalId = setInterval(function () {
                if ($scope.vCodeLifetime < 0) {
                    clearInterval(intevalId);
                    $scope.isEnableSend = true;
                    $timeout(function () {
                        $scope.btnText = "发送短信验证码";
                    }, 0);
                } else {
                    $scope.vCodeLifetime--;
                    $timeout(function () {
                        $scope.btnText = "重新发送(" + $scope.vCodeLifetime + ")";
                    }, 0);
                }
            }, 1000);
        }

        //---发送重置密码
        $scope.postResetPwd = function () {
            $scope.isSubmitted = true;
            if ($scope.form.$invalid) {
                return;
            }

            accountService.resetPwd($scope.ResetPasswordModel).$promise.then(function (response) {
                var result = response.data;
                if (result.Code == 0) {
                    uiKit.message("新的密码已发送，请注意查收！");
                    $location.path("/mobileLogin");
                } else {
                    uiKit.message(result.Message);
                }
            });
        };
    }]);
})();