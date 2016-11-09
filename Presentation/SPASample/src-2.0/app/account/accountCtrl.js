define(['ng-core'], function (module) {
    var module = angular.module('account', ['account.Service']);

    module.controller("resetPasswordCtrl", ['$scope', '$location', '$rootScope', 'accountService', 'oauthService', 'scopeService', function ($scope, $location, $rootScope, accountService, oauthService, scopeService) {

        //----初始化
        var currentUser = oauthService.getIdentityInfo().UserInfo;
        $scope.changePwdModel = {
            account: currentUser.name,
            oldPassword: '',
            newPassword: ''
        };

        $scope.openResetModal = function () {
            resetForm();
        };

        //----清空表单
        function resetForm() {
            $('#oldPassword').val('');
            $('#newPassword').val('');
            $('#errorOldPssword').hide();
            $('#errorNewPssword').hide();
        }

        $scope.changePassword = function () {
            $scope.changePwdForm.isSubmitted = true;
            if ($scope.changePwdForm.$invalid) {
                $('#errorOldPssword').show();
                $('#errorNewPssword').show();
                return false;
            }
            accountService.changePassword($scope.changePwdModel).$promise.then(function () {
/*                bootbox.setLocale("zh_CN");*/
                bootbox.confirm("密码修改成功,下次您将使用新的密码登录本系统！", function (result) {
                    if (result) {
                        oauthService.goToLoginPage();
                    }
                });
            }, function (response) {
                bootbox.alert(response.data.Message);
            });
        }

    }]);
});