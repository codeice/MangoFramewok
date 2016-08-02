define(['../contentModule', '../../directives/dirTree'], function (module) {
    module.controller('selectUserCtrl', ['$scope', '$filter', '$location', 'organizationService', function ($scope, $filter, $location, orgService) {
        //回调函数
        var queryStr = window.location.search;
        var callback = "";
        var type = "open"; //type 默认只能填modal 或者open

        //从url 获取type and callback
        function getUrlParams(queryParams) {
            if (queryParams.indexOf('?') >= 0) {
                queryParams = queryParams.substr(1);
                if (queryParams.indexOf('&') >= 0) {
                    var params = queryParams.split('&');
                    for (var i = 0; i < params.length; i++) {
                        var param = params[i];
                        var paramMetas = param.split('=');
                        if (paramMetas[0] == "type") {
                            type = paramMetas[1];
                        }
                        if (paramMetas[0] == "callback") {
                            callback = paramMetas[1];
                        }
                    }
                } else {
                    callback = queryParams.split('=')[1];
                }
            }
        }

        getUrlParams(queryStr);

        $scope.keyword = "";

        ///////////////////////////department tree////////////////////////////
        //tree setting
        $scope.treeConfig = {
            isExpandRootNode: true
        };

        //-----获取跟部门列表
        orgService.getRootDeptNodes().$promise.then(function (response) {
            $scope.rootDepts = response.data;
        });

        //------点击Node事件
        $scope.clickNode = function (treeNode) {
            //加载部门用户
            $scope.doSearch();
        }

        //----加载子节点数据
        $scope.loadChildNodes = function (treeNode, treeObj) {
            orgService.getSubDeptNodes(treeNode.id).$promise.then(function (response) {
                var childNodes = response.data;
                treeObj.addNodes(treeNode, childNodes, false);
            });
        }

        //----搜索
        $scope.doSearch = function () {
            $scope.users = orgService.getUsersByDeptId($scope.deptTree.currentNode.Id, $scope.keyword);
        }

        //-----全选
        $scope.checkAll = function () {
            for (var i = 0; i < $scope.users.length; i++) {
                var user = $scope.users[i];
                user.checked = true;
            }
        }

        //-----取消所有选中的用户
        $scope.clearChecked = function () {
            for (var i = 0; i < $scope.users.length; i++) {
                var user = $scope.users[i];
                user.checked = false;
            }
        }

        //-------------将user的checeked设置为false
        $scope.removeUser = function (user) {
            user.checked = false;
        }

        //-----确认选择
        $scope.confirmSelect = function () {
            $scope.selectedUsers = $filter('filter')($scope.users, { 'checked': true });
            if ($scope.selectedUsers.length == 0) {
                bootbox.alert("请选择人员");
                return;
            }
            if (callback == "") {
                console.log("回调函数不能为空");
            }
            //新窗口打开
            if (type == "open") {
                window.opener[callback]($scope.selectedUsers);
                window.close();
                $scope.clearChecked();
            } else {
                //iframe
                window.parent[callback]($scope.selectedUsers);
                bootbox.alert("选人成功");
                $scope.clearChecked();
            }
        }

    }]);
})