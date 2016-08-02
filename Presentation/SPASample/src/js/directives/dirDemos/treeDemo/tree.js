define(['../../module', '../../directives/dirTree'], function (module) {
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/query',
        {
            templateUrl: 'js/controllers/query/views/query.html?nc=' + Math.random(),
            controller: 'queryTreeCtrl'
        });
    }]);


    //----Tree风格
    module.controller('queryTreeCtrl', ['$scope', '$location', '$rootScope', 'queryService', function ($scope, $location, $rootScope, queryService) {

        ////////////////////////tree的配置//////////////////////////
        $scope.treeConfig = {
            isExpandRootNode: false,
            isEditEnable: true //开启拖动功能
        };

        //----获取根节点数据
        queryService.getRootNodes().$promise.then(function (response) {
            $scope.rootNodes = response.data;
        });

        //点击节点，加载详情页面，并loadTable数据
        $scope.clickNode = function (treeNode) {
            queryService.getQueryResult(treeNode.id).$promise.then(function (response) {
                $scope.nodeInfo = response.data;
                angular.extend($scope.tree.currentNode, { Code: $scope.nodeInfo.Code });
            });

            //table数据
            $scope.doSearch();
        }

        //----展开树加载子节点
        $scope.loadChildren = function (treeNode, treeObj) {
            queryService.getChildrenNodes(treeNode.id).$promise.then(function (response) {
                var childNodes = response.data;
                treeObj.addNodes(treeNode, childNodes, false);
            });
        }

        //----节点移动
        var moveTypes = ["inner", "prev", "next"];
        //----节点移动
        $scope.moveNode = function (sourceNode, targetNode, moveType) {
            console.log("MoveType=", moveType);
            console.log("TargetNode=", targetNode);
            console.log("sourceNode=", sourceNode);
            queryService.getQueryResult(sourceNode.id).$promise.then(function (response) {
                var node = response.data;
                //移动成为目标节点的子节点
                if (moveType === moveTypes[0]) {
                    node.ParentId = targetNode.id;
                    node.ParentCode = targetNode.code;
                }
                //移动成为同级节点的前一个节点
                if (moveType === moveTypes[1]) {
                    if (sourceNode.pId == 0) {
                        node.ParentId = null;
                        node.ParentCode = "";
                        node.SortIndex = targetNode.sortIndex == 1 ? 0 : targetNode.sortIndex - 1;
                    }
                }

                //移动成为同级节点的下一个节点
                if (moveType === moveTypes[2]) {
                    if (sourceNode.pId == 0) {
                        node.ParentId = null;
                        node.ParentCode = "";
                        node.SortIndex = targetNode.SortIndex + 1;
                    }
                }


                queryService.updateQueryResult(node.Id, node);
            });
        }

        /////////////////////////节点的增删改查///////////////////////

        function initSearchModel() {
            //----searchModel 初始化
            if (angular.isUndefined($scope.searchModel)) {
                $scope.searchModel = {
                    PageNumber: 1, //页码
                    PageSize: 10, //每页显示记录数
                    //搜索条件配置
                    Name: ""
                };
            }
        }

        //----搜索
        $scope.doSearch = function () {
            initSearchModel();
            $scope.pageModel = queryService.pageFindChildren($scope.tree.currentNode.Id, $scope.searchModel);
            $scope.pageModel.$promise.then(function (response) {
                $scope.results = response.data.Data;
            });
        }

        //----翻页
        $scope.changePage = function (pageNumber) {
            $scope.searchModel.PageNumber = pageNumber;
            $scope.doSearch();
        };

        //----添加时检查Code是否重复
        $scope.checkCodeIsExsit = function () {
            $scope.isCodeExist = false;
            if (angular.isUndefined($scope.node.Code) || $scope.node.Code == null) {
                return;
            }
            if (!angular.isUndefined($scope.originalCode) && $scope.node.Code == $scope.originalCode) {
                return;
            }
            queryService.checkCodeIsExist($scope.node.Code).$promise.then(function (response) {
                var id = response.data.Id;
                if (id != null && id != $scope.node.Id) {
                    $scope.isCodeExist = true;
                }
            });
        }

        //----重置表单
        function resetForm() {
            $scope.node = {};
            $scope.addOrEditForm.$setPristine();
            $scope.addOrEditForm.isSubmitted = false;
        }

        //----添加根节点
        $scope.addRootNode = function () {
            resetForm();
            $scope.modalTitle = "添加根节点";
            $scope.node.ParentId = null;
        }

        //----添加子节点
        $scope.addChild = function () {
            resetForm();
            $scope.modalTitle = "添加子节点";
            if ($scope.tree.currentNode != null) {
                $scope.node.ParentId = $scope.tree.currentNode.Id;
                $scope.node.ParentCode = $scope.tree.currentNode.Code;
            }
        }

        //----编辑节点
        $scope.editNode = function () {
            if (angular.isUndefined($scope.tree.currentNode) || $scope.tree.currentNode == null) {
                bootbox.alert("请选择你要编辑的节点");
                return;
            }
            $scope.modalTitle = "编辑节点";
            queryService.getQueryResult($scope.tree.currentNode.Id).$promise.then(function (response) {
                $scope.node = response.data;
                $scope.originalCode = $scope.node.Code;
            }, function (response) {
                bootbox.alert("获取详情失败," + response.data.Message);
            });
        }

        //----保存节点
        $scope.save = function () {
            $scope.addOrEditForm.isSubmitted = true;
            if ($scope.addOrEditForm.$invalid || $scope.isCodeExist) {
                return;
            }
            if ($scope.node.Id == null) {
                saveAdd();
            } else {
                saveEdit();
            }
        }

        //----保存新建Node 
        function saveAdd() {
            //----添加节点  
            queryService.addQueryResult($scope.node).$promise.then(function (response) {
                var result = response.data;
                //----add root department
                var updateMsg;
                if ($scope.tree.currentNode == null || $scope.node.ParentId == null) {
                    updateMsg = {
                        type: "addRoot",
                        nodeId: result.Id,
                        nodeName: result.Name
                    };
                } else {
                    //----add subDepartment
                    updateMsg = {
                        type: "add",
                        nodeId: $scope.tree.currentNode.Id
                    };
                }
                $scope.$broadcast("updateTreeNode", updateMsg);
                bootbox.alert("添加成功");
                $("#addOrEditModal").modal("hide");
            }, function (response) {
                bootbox.alert("添加失败," + response.data.Message);
            });
        }

        //----保存编辑的Node
        function saveEdit() {
            queryService.updateQueryResult($scope.node.Id, $scope.node).$promise.then(function () {
                var updateMsg = {
                    type: "update",
                    nodeId: $scope.node.Id,
                    nodeName: $scope.node.Name
                };
                $scope.$broadcast("updateTreeNode", updateMsg);
                bootbox.alert("修改成功");
                $("#addOrEditModal").modal("hide");
            }, function (response) {
                bootbox.alert("修改失败," + response.data.Message);
            });
        }

        //---删除节点
        $scope.deleteNode = function () {
            if (angular.isUndefined($scope.tree.currentNode)) {
                bootbox.alert("请选择你要删除的资源");
                return;
            }
            bootbox.confirm("节点删除后将无法恢复，确定要删除所选择的节点 ？", function (result) {
                if ($scope.tree.currentNode.Id != null && result) {
                    queryService.deleteQueryResult($scope.tree.currentNode.Id).$promise.then(function () {
                        var updateMsg = {
                            type: "delete",
                            nodeId: $scope.tree.currentNode.Id
                        };
                        $scope.$broadcast("updateTreeNode", updateMsg);
                        if ($scope.tree.currentNode == null) {
                            $scope.nodeInfo = {};
                        }
                        bootbox.alert("删除成功");
                    }, function (response) {
                        bootbox.alert("删除失败," + response.data.Message);
                    });
                }
            });
        }

        ////////////////////List风格数据////////////////////////
        $scope.keyword = "";
        $scope.loadQueryList = function () {
            $scope.queryList = queryService.getFirstLevelChildren($scope.keyword);
        }

    }]);


});