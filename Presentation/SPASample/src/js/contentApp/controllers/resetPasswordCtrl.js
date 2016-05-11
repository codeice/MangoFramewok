define(['../contentModule'], function (module) {
    module.controller("resetPasswordCtrl", ['$scope', '$location', '$rootScope', 'scopeService', 'accountService', function ($scope, $location, $rootScope, scopeService, accountService) {

        var currentUser = angular.fromJson(sessionStorage.getItem('user_info'));
        $scope.changePwdModel = {
            account: currentUser.name,
            oldPassword: "",
            newPassword: ""
        }
        $scope.changePassword = function () {
            if ($scope.changePwdModel.oldPassword === "") {
                bootbox.alert("请输入原密码！");
                return;
            }
            if ($scope.changePwdModel.newPassword === "") {
                bootbox.alert("新密码不能为空！");
                return;
            }
            accountService.changePassword($scope.changePwdModel).$promise.then(function () {
                bootbox.setLocale("zh_CN");
                bootbox.confirm("密码修改成功，跳转到WSAF管理平台？", function (result) {
                    if (result) {
                        window.location.href = $rootScope.appConfig.baseUrl;
                    }
                });
            }, function (response) {
                bootbox.alert(response.data.Message);
            });
        }

    }]);
});