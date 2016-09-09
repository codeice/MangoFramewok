function accountServiceProxy($location, service, appConfig) {

    //---发送短信
    this.sendSMS = function (model) {
        return service.backgroundCall(appConfig.oauthServer + "Accounts/SendVerificationCode", model, "post");
    };

    //---手机号注册
    this.mobileRegister = function(model) {
        return service.call(appConfig.oauthServer + "Delegation/realnameregister", model, "post");
    };

    //----更新token
    this.RefreshToken = function() {
        return service.backgroundCall(appConfig.oauthServer + "Delegation/refreshtoken", model, "post");
    };

    //---账号登录
    this.accountLogin = function (model) {
        return service.call(appConfig.oauthServer + "Delegation/requesttoken", model, "post");
    };

    //---手机号+密码登录
    this.mobileLogin = function(model) {
        return service.backgroundCall(appConfig.oauthServer+"Delegation/requesttoken", model, "post");
    };
    
    //---手机号+验证码登录
    this.verificationCodeLogin = function (model) {
        return service.call(appConfig.oauthServer + "Delegation/requesttoken/mobile", model, "post");
    };

    
    //---重置密码
    this.resetPwd = function (resetPwdModel) {
        return service.call(appConfig.oauthServer + "Accounts/ResetPassword",resetPwdModel,"post");
    };
    
    //---修改密码
    this.changePwd = function (model) {
        return service.authorizedLoadingCall(appConfig.oauthServer + "Accounts/ChangePassword", model, "post");
    };

    //---获取当前用户信息
    this.getCurrentUser = function(token) {
        //return service.authorizedLoadingCall(appConfig.oauthServer + "Accounts/UserInfo", {}, "get");
        return service.call(appConfig.oauthServer + "Accounts/UserInfo", {}, "get", token);
    };

    //---注销
    this.logOut = function () {
        return service.authorizedCall("Accounts/Logout", {}, "post");
    };

}

angular.module('account.service', []).factory('accountService', ['$location', 'service', 'appConfig', function ($location, service, appConfig) {
    return new accountServiceProxy($location, service, appConfig);
}]);