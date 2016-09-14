define(['ng-core'], function () {

    function DemoService(service, backgroundService) {

        this.checkUserNameExist = function (userName) {
            return backgroundService.call("MockUsers/" + userName + "/NameExists", {}, "get");
        }

        this.pageFindUsers = function (searchModel) {
            return service.call("MockUsers/PageFind", searchModel, "post");
        }

        this.getUserList = function () {
            return service.call("MockUsers", {}, "get");
        }

        this.getUser = function (id) {
            return service.call("MockUsers/" + id, {}, "get");
        };

        this.addUser = function (user) {
            return service.call("MockUsers", user, "post");
        };

        this.deleteUser = function (id) {
            return service.call("MockUsers/" + id, {}, "delete");
        };

        this.batchDeleteUser = function (ids) {
            return service.call("MockUsers/BatchDelete", ids, "post");
        }

        this.updateUser = function (id, user) {
            return service.call("MockUsers/" + id, user, "put");
        };

    }

    var module = angular.module('demo.service', []);
    module.factory("demoService", ['service', 'backgroundService', function (service, backgroundService) {
        var demoService = new DemoService(service, backgroundService);
        return demoService;
    }]);
});