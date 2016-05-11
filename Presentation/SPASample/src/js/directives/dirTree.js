/*treeConfig = {
    isExpandRootNode: true, //根借调是否展开
    isEditEnable: true, //设置 zTree 是否处于编辑状态（拖拽操作必须设置成eidit状态才可以）
    isAddHoverDom:true,//hover节点是否出现增删改按钮
    check: {
         enable: true,  //设置 zTree 的节点上是否显示 checkbox / radio
         chkStyle: "radio" //checkbox 或 radio
     },
    onAddNode:function(){}, 
    onRemoveNode:function(){}, 
    onEditNode:function(){}
};
treeDataDemo=[{
                    id: item.Id,
                    pId: item.ParenteId,
                    name: item.Name,
                    isParent:true
                }];
*/

tree_v = "1.1";
define(['../modules/dirModule', 'zTree'], function (module) {

    //*****************ztree directive********************//
    module.directive('dirTree', ['scopeService', function (scopeService) {
        var dirObj = {
            reistrict: "A",
            scope: {
                tree: "=?dirTree", //ztree 实例
                treeConfig: '=treeConfig', //zTree配置项
                treeData: '=treeData', //tree初始化数据源

                clickNode: '=clickNode', //点击节点事件
                loadChildNodes: '=loadChildNodes', //expand节点加载子节点数据事件
                moveNode: '=moveNode',//移动节点事件
                checkNode: '=checkNode'//checkbox/radio勾选或者取消勾选节点事件
            },
            link: function (scope, element, attrs) {

                if (angular.isUndefined(scope.tree) || scope.tree == null) {
                    scope.tree = {};
                }

                //初始化tree容器id
                var id = 'angular-' + Math.floor((Math.random() * 999999999) + 1);
                if (attrs.id) {
                    element[0].id = attrs.id;
                } else {
                    attrs.id = id;
                    element[0].id = id;
                }


                var treeObj = null;
                /////////////////////////tree config的配制///////////////////////////
                //ztree setting start 
                var setting = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: 0
                        }
                    },
                    view: {
                        showIcon: true,
                        showLine: true,
                        showTitle: true
                    },
                    callback: {
                        onClick: treeNodeClick,
                        onExpand: treeNodeExpand,
                        onDrop: treeNodeOnDrop,
                        onCheck: treeNodeOnCheck
                    }
                };//end setting

                if (!angular.isUndefined(scope.treeConfig)) {
                    //add button for node (add edit remove button)
                    if (!angular.isUndefined(scope.treeConfig.isAddHoverDom) && scope.treeConfig.isAddHoverDom) {
                        var tempView = {
                            addHoverDom: addHoverDom,
                            removeHoverDom: removeHoverDom,
                            selectedMulti: false
                        };
                        angular.extend(setting.view, tempView);
                    }//end hover dom

                    //edit
                    if (!angular.isUndefined(scope.treeConfig.isEditEnable) && scope.treeConfig.isEditEnable) {
                        var edit = {
                            enable: true,
                            showRemoveBtn: false,
                            showRenameBtn: false
                        };
                        setting.edit = edit;
                    }//end edit

                    //check
                    if (!angular.isUndefined(scope.treeConfig.check)) {
                        setting.check = scope.treeConfig.check;
                        if (!angular.isUndefined(setting.check.chkStyle)) {
                            if (setting.check.chkStyle == "checkbox") {
                                setting.check.chkboxType = { "Y": "", "N": "" };
                            }
                            if (setting.check.chkStyle == "radio") {
                                setting.check.radioType = "all";
                            }
                        }
                    }//end check
                }

                //////////////////////////treeNode 的点击事件///////////////////////////
                //节点点击事件
                function treeNodeClick(event, treeId, treeNode) {
                    if (treeNode == null) {
                        return;
                    }
                    treeObj.selectNode(treeNode);
                    //设置currentNode
                    if (scope.tree.currentNode) {
                        scope.tree.currentNode = {};
                    }
                    scope.tree.currentNode = { Id: treeNode.id, Name: treeNode.name, ParentId: treeNode.pId };
                    scopeService.safeApply(scope);
                    if (!angular.isUndefined(scope.clickNode)) {
                        scope.clickNode(treeNode);
                        scopeService.safeApply(scope);
                    }
                }

                //节点展开事件（调用treeNodeClick事件）
                function treeNodeExpand(event, treeId, treeNode) {
                    if (treeNode == null) {
                        return;
                    }
                    treeObj.selectNode(treeNode);
                    treeNodeClick(event, treeId, treeNode);
                    if (!angular.isUndefined(scope.loadChildNodes)) {
                        if (angular.isUndefined(treeNode.children)) {
                            scope.loadChildNodes(treeNode, treeObj);
                        }
                    }
                }

                //节点拖拽，drop事件
                function treeNodeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
                    if (!angular.isUndefined(scope.moveNode)) {
                        var sourceNode = treeNodes[0];
                        scope.moveNode(sourceNode, targetNode);
                    }
                }

                //节点选中事件
                function treeNodeOnCheck(event, treeId, treeNode) {
                    if (!angular.isUndefined(scope.checkNode)) {
                        scope.checkNode(treeNode);
                    }
                }

                //触发根节点的点击事件，并判断是否展开是否展开根节点
                function expandRootNode() {
                    var nodes = treeObj.getNodes();
                    if (nodes.length >= 1) {
                        treeObj.selectNode(nodes[0]);
                        if (!angular.isUndefined(scope.treeConfig) && !angular.isUndefined(scope.treeConfig.isExpandRootNode) && scope.treeConfig.isExpandRootNode == true) {
                            //调用事件  
                            treeObj.setting.callback.onExpand(null, treeObj.setting.treeId, nodes[0]);
                        }
                    }
                }

                function getSelectedNodes() {
                    var selectedNodes = treeObj.getSelectedNodes();
                    if (!angular.isUndefined(scope.getSelectedNodes)) {
                        scope.getSelectedNodes(getSelectedNodes(selectedNodes));
                    }
                }

                //Hover Dom
                function addHoverDom(treeId, treeNode) {
                    var nodeTitle = $("#" + treeNode.tId + "_span");
                    //删除按钮
                    if (treeNode.editNameFlag || $("#removeBtn_" + treeNode.tId).length > 0)
                        return;
                    var removeBtnStr = "<span class='button remove' id='removeBtn_" + treeNode.tId
                        + "' title='remove node'></span>";
                    nodeTitle.after(removeBtnStr);

                    //编辑按钮
                    if (treeNode.editNameFlag || $("#editBtn_" + treeNode.tId).length > 0)
                        return;
                    var editBtnStr = "<span class='button edit' id='editBtn_" + treeNode.tId
                        + "' title='edit node'></span>";
                    nodeTitle.after(editBtnStr);

                    //添加按钮
                    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
                        return;
                    var addBtnStr = "<span class='button add' id='addBtn_" + treeNode.tId
                        + "' title='add node' onfocus='this.blur();'></span>";
                    nodeTitle.after(addBtnStr);

                    //添加按钮事件
                    var addBtn = $("#addBtn_" + treeNode.tId);
                    if (addBtn) {
                        addBtn.bind("click", function () {
                            if (!angular.isUndefined(scope.treeConfig) && !angular.isUndefined(scope.treeConfig.onAddNode)) {
                                scope.treeConfig.onAddNode(treeNode);
                            }
                        });
                    }

                    //删除按钮事件
                    var removeBtn = $("#removeBtn_" + treeNode.tId);
                    if (addBtn) {
                        addBtn.bind("click", function () {
                            if (!angular.isUndefined(scope.treeConfig) && !angular.isUndefined(scope.treeConfig.onRemoveNode)) {
                                scope.treeConfig.onRemoveNode(treeNode);
                            }
                        });
                    }

                    //编辑按钮事件
                    var editBtn = $("#editBtn_" + treeNode.tId);
                    if (editBtn) {
                        editBtn.bind("click", function () {
                            if (!angular.isUndefined(scope.treeConfig) && !angular.isUndefined(scope.treeConfig.onEditNode)) {
                                scope.treeConfig.onEditNode(treeNode);
                            }
                        });
                    }
                };

                function removeHoverDom(treeId, treeNode) {
                    $("#addBtn_" + treeNode.tId).unbind().remove();
                    $("#editBtn_" + treeNode.tId).unbind().remove();
                    $("#removeBtn_" + treeNode.tId).unbind().remove();
                };

                //----检测treeData,变化后initTree
                scope.$watch("treeData", function () {
                    if (!angular.isArray(scope.treeData)) {
                        return;
                    }

                    //initTree
                    $.fn.zTree.init(element, setting, scope.treeData);
                    treeObj = $.fn.zTree.getZTreeObj(attrs.id);

                    //是否展开根节点
                    expandRootNode();
                });//end watch

                //----更新节点
                function refreshNode(type, id, name) {
                    if (treeObj != null) {
                        var currentSelectedNode = treeObj.getNodeByParam("id", id, null);
                        switch (type) {
                            case "update":
                                //修改当前选中节点,并触发expand事件
                                if (currentSelectedNode == null) {
                                    return;
                                }
                                currentSelectedNode.name = name;
                                treeObj.updateNode(currentSelectedNode);
                                treeObj.setting.callback.onClick(null, treeObj.setting.treeId, currentSelectedNode);
                                break;
                                //重新加载该加点的子节点
                            case "add":
                                if (currentSelectedNode == null) {
                                    return;
                                }
                                //update selected node when add a sub node
                                treeObj.removeChildNodes(currentSelectedNode);
                                treeObj.setting.callback.onExpand(null, treeObj.setting.treeId, currentSelectedNode);
                                break;
                            case "delete":
                                //update selected's parent node when delete selected node 
                                var parentNode = currentSelectedNode.getParentNode();
                                treeObj.removeNode(currentSelectedNode);
                                if (parentNode == null) {
                                    scope.tree.currentNode = null;
                                } else {
                                    treeObj.selectNode(parentNode);
                                    scope.tree.currentNode = { Id: parentNode.id, Name: parentNode.name, ParentId: parentNode.pId };
                                    scopeService.safeApply(scope);
                                }
                                treeObj.setting.callback.onExpand(null, treeObj.setting.treeId, parentNode);
                                break;
                            case "addRoot":
                                //添加根节点
                                var rootNode = {
                                    id: id,
                                    pId: null,
                                    name: name,
                                    isParent: true
                                };
                                treeObj.addNodes(null, rootNode);
                                treeObj.setting.callback.onExpand(null, treeObj.setting.treeId, rootNode);
                                break;
                            default:
                                break;
                        }
                    }
                }//end refresh node func

                //递归取消radio的选中节点
                function cancelCheckedNodesRecusive(node) {
                    treeObj.checkNode(node, false, true);
                    if (node.children == undefined) {
                        return;
                    }
                    for (var i = 0; i < node.children.length; i++) {
                        cancelCheckedNodesRecusive(node.children[i]);
                    }
                }

                //捕获checkbox or radio的取消选中事件
                scope.$on("cancelCheckedNodes", function () {
                    if (!angular.isUndefined(scope.treeConfig.check)) {
                        if (!angular.isUndefined(setting.check.chkStyle)) {
                            if (setting.check.chkStyle == "checkbox") {
                                treeObj.checkAllNodes(false);
                            }
                            if (setting.check.chkStyle == "radio") {
                                var nodes = treeObj.getNodes();
                                for (var i = 0; i < nodes.length; i++) {
                                    cancelCheckedNodesRecusive(nodes[i]);
                                }
                            }
                        }
                    }
                });

                //捕获树更新事件
                scope.$on('updateTreeNode', function (event, eventArg) {
                    if (angular.isObject(eventArg)) {
                        refreshNode(eventArg.type, eventArg.nodeId, eventArg.nodeName);
                    }
                });

            }//end link fn
        };//end directive obj
        return dirObj;
    }]);

});