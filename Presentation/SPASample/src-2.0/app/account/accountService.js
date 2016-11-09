define(['ng-core'], function () {

    function AccountPasswordService(service, backgroundService) {
        this.changePassword = function (changePasswordModel) {
            return service.call(window.config.appConfig.wsafApiServer + "Profiles/ChangePassword", changePasswordModel, "post");
        }
    }

    var module = angular.module('account.Service', []);

    module.factory("accountService", ['service', 'backgroundService', function (service, backgroundService) {
        var _service = new AccountPasswordService(service, backgroundService);
        return _service;
    }]);
});