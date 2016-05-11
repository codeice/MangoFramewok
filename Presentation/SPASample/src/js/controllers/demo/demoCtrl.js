define(['../../modules/ctrlModule', '../../directives/dirPage', '../../directives/dirUmeditor', '../../directives/dirDatepicker', '../../directives/dirUploadify', '../../directives/dirUploadImage', '../../directives/dirUploadFile'], function (module) {
    module.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/demo',
            {
                templateUrl: 'js/controllers/demo/views/demo.html?nc=' + Math.random(),
                controller: 'demoCtrl'
            })
            .when('/formTemplate',
            {
                templateUrl: 'js/controllers/demo/views/formTemplate.html?nc=' + Math.random(),
                controller: 'formCtrl'
            });
    }]);

    module.controller("demoCtrl", ['$scope', '$location', 'demoService', 'scopeService', function ($scope, $location, demoService, scopeService) {
        $scope.title = "CRUD Demo";
        //////////////////////////////Demo CRUD///////////////////////////////
        //----searchModel 初始化
        if (angular.isUndefined($scope.searchModel)) {
            $scope.searchModel = {
                PageNumber: 1, //页码
                PageSize: 2, //每页显示记录数
                //搜索条件配置
                Name: "",
                IDCardNo: ""
            };
        }

        //----搜索
        $scope.doSearch = function () {
            //每次搜索将全选设置成false
            $scope.isAllChecked = false;
            $scope.pageModel = demoService.pageFindUsers($scope.searchModel);
            $scope.pageModel.$promise.then(function (response) {
                $scope.users = response.data.Data;
            });
        }

        $scope.doSearch();

        //----翻页
        $scope.changePage = function (pageNumber) {
            $scope.searchModel.PageNumber = pageNumber;
            $scope.doSearch();
        };

        //----获取所有选中的用户
        function getAllSelectedUsers() {
            $scope.selectedUsers = [];
            $scope.selectedUserIds = [];
            for (var i = 0; i < $scope.users.length; i++) {
                var user = $scope.users[i];
                if (user.checked) {
                    $scope.selectedUsers.push(user);
                    $scope.selectedUserIds.push(user.Id);
                }
            }
        }

        //----mock学历列表
        $scope.educationList = ["中专", "大专", "本科", "硕士", "博士"];

        //----MajorDic
        $scope.majorList = [
            { code: 0, value: "计算机" },
            { code: 1, value: "日语" },
            { code: 2, value: "英语" }
        ];

        //----添加时检查名字是否重复
        $scope.checkUserNmeIsExsit = function () {
            $scope.isUserNameExist = false;
            if (angular.isUndefined($scope.user.Name) || $scope.user.Name == null) {
                return;
            }
            if (!angular.isUndefined($scope.originalUser) && $scope.user.Name == $scope.originalUser.Name) {
                return;
            }
            demoService.checkUserNameExist($scope.user.Name).$promise.then(function (response) {
                var id = response.data.Id;
                if (id != null && id != $scope.user.Id) {
                    $scope.isUserNameExist = true;
                }
            });
        }

        //----获取属性详情
        $scope.getUserDetail = function (id) {
            demoService.getUser(id).$promise.then(function (response) {
                $scope.userInfo = response.data;
            }, function (response) {
                bootbox.alert("获取属性详情失败," + response.data.Message);
            });
        }

        //定义用户模型
        function userModel() {
            this.Gender = "男";
        }

        //----新增
        $scope.addUser = function () {
            $scope.modalTitle = "新增用户";
            $scope.user = new userModel();
            $scope.addOrEditForm.$setPristine();
            $scope.addOrEditForm.isSubmitted = false;
        }

        //----修改属性
        $scope.editUser = function (user) {
            $scope.modalTitle = "编辑用户";
            $scope.addOrEditForm.isSubmitted = false;
            $scope.originalUser = user;
            $scope.user = angular.copy(user, $scope.user);
            $scope.addOrEditForm.$setPristine();
        }

        //---保存新建或修改的属性
        $scope.saveUser = function () {
            $scope.addOrEditForm.isSubmitted = true;
            if ($scope.addOrEditForm.$invalid || $scope.isUserNameExist) {
                return;
            }
            if ($scope.user.Id == null) {
                demoService.addUser($scope.user).$promise.then(function () {
                    $scope.doSearch();
                    $("#addOrEditModal").modal('hide');
                    bootbox.alert("添加成功");

                });
            }
            else {
                demoService.updateUser($scope.user.Id, $scope.user).$promise.then(function () {
                    $scope.doSearch();
                    $("#addOrEditModal").modal('hide');
                    bootbox.alert("修改成功");
                });
            }
        };

        //----单个应用删除应用
        $scope.deleteUser = function (user) {
            bootbox.setLocale("zh_CN");
            bootbox.confirm("数据删除后将无法恢复，你确认是否要删除？", function (result) {
                if (result) {
                    demoService.deleteUser(user.Id).$promise.then(function () {
                        bootbox.alert("删除成功");
                        $scope.doSearch();
                    }, function (response) {
                        bootbox.alert(response.data);
                    });
                }
            });
        }

        //----批量删除用户
        $scope.batchDeleteUser = function () {
            getAllSelectedUsers();
            if ($scope.selectedUsers.length == 0) {
                bootbox.alert("请先勾选你要删除的数据行");
                return;
            }
            bootbox.setLocale("zh_CN");
            bootbox.confirm("数据删除后将无法恢复，你确认是否要删除？", function (result) {
                if (result) {
                    demoService.batchDeleteUser($scope.selectedUserIds).$promise.then(function () {
                        bootbox.alert("删除成功");
                        $scope.doSearch();
                    }, function (response) {
                        bootbox.alert("删除失败," + response.data);
                    });
                }
            });
        }


        //----form teplate
        $scope.goToFormTemplate = function () {
            $location.path('/formTemplate');
        }
    }]);


    ///////////////////form Template////////////////////////
    module.controller('formCtrl', ['$scope', 'appConstants', 'scopeService', 'fileService', function ($scope, appConstants, scopeService, fileService) {
        $scope.genders = appConstants.genders;
        //----岗位分类
        $scope.positionCategories = [{ Key: 1, Value: "test" }];

        //----岗位等级
        $scope.positionLevels = [{ Key: 1, Value: "test" }];

        $scope.model = {};
        $scope.model = { Article: "<p >Hello world</p>" };

        ///选人插件回调
        function callback(selectedUsers) {
            scopeService.safeApply($scope, function () {
                $scope.selectedUsers = selectedUsers;
                console.log("选择的人员=", selectedUsers);
            });
        }

        $scope.openWindow = function () {
            selectUser("open", callback);
        }

        $scope.openModal = function () {
            selectUser("modal", callback);
        }

        //----上传地址
        $scope.uploadUrl = fileService.getUploadFileUrl();
        //////////////////////////////dirUploadify//////////////////////////////
        $scope.uploader = {};
        $scope.uploaderSettings = {
            maxFileSize: 4, //in MB 文件大小限制
            fileTypes: "*.gif;*.jpg;*.xls;*.xlsx;", //可接受的文件类型  '*.gif; *.jpg; *.png',
            isAuto: true,
            isMultiple: true
        };
        $scope.onSuccess = function (file, returnData, uploader) {
            console.log("file=", file);
            console.log("returnData=", returnData);
            console.log("uploader=", uploader);
        }

        ///////////////////////////dirUploadImage///////////////////////////
        /*  $scope.uploadedFile = { url: "http://localhost/wsaf.portal/images/test.png" };*/


        ///////////////////////////dirUploadFile///////////////////////////
        $scope.uploadedFiles = [
        {
            url: "http://localhost/wsaf.portal/images/test.png",
            name: "test.png"
        },
        {
            url: "http://localhost/wsaf.portal/images/test1.png",
            name: "test1.png"
        }];


        /*     //---- 选人新窗口
        $scope.openWindow = function () {
            var funcId = "func" + new Date() * 1;//这里你随机生成一个 id
            window[funcId] = callback;
            var url = "http://localhost/wsaf.portal/selectUser.html?type=open&callback=" + funcId;
            window.open(url);
        }

        //modal iframeurl
        var getSelectUserUrl = function () {
            var funcId = "func" + new Date() * 1;//这里你随机生成一个 id
            window[funcId] = callback;
            $scope.ifmSrc = "http://localhost/wsaf.portal/selectUser.html?type=modal&callback=" + funcId;
        }
        getSelectUserUrl();

        $scope.openModal = function () {
            $("#selectUserModal").modal();
        }*/
    }]);
});