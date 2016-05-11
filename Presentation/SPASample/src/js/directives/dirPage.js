/*
 * page 1.1
 * pageModel={
 *      PageCount:10; //页数
 *      RecordCount:20; //总记录数
 *      PageNumber:1, //页码
 *      PageSize:10 //每页显示记录数
 *    }
 */
page_v = "1.1";
define(['../modules/dirModule'], function (module) {

    module.directive('dirPage', ['scopeService', '$compile', function (scopeService, $compile) {
        return {
            restrict: 'A',
            scope: {
                pageModel: "=?pageModel",
                onPageChange: "=?pageChange", //页码改变事件
                settings: "=?settings" //自定义pageSize and pageRange
            },
            templateUrl: 'js/directives/templates/page.html',
            link: function (scope, element, attrs) {
                //setting 初始化
                function initSettings() {
                    if (angular.isUndefined(scope.settings)) {
                        scope.settings = {};
                    }
                    if (angular.isUndefined(scope.settings.pageSize)) {
                        scope.settings.pageSize = 1;
                    }
                    if (angular.isUndefined(scope.settings.pageRange)) {
                        scope.settings.pageRange = 10;
                    }
                }

                //初始化页面
                function initPage() {
                    //当前页码距离首页 页数小于显示页数的一半
                    if (scope.pageIndex < scope.settings.pageRange / 2) {
                        //currentIndex后半部分该显示的页码个数
                        scope.pageCountAfterCurrentIndex = scope.settings.pageRange - scope.pageIndex;
                    } else {
                        scope.pageCountAfterCurrentIndex = Math.floor(scope.settings.pageRange / 2);
                    }

                    //当前页码距离尾页 页数小于显示页数的一半
                    if (scope.pageCount - scope.pageIndex < scope.settings.pageRange / 2) {
                        //算前半部分该显示的页码个数
                        scope.pageCountBeforeCurrentIndex = scope.settings.pageRange - (scope.pageCount - scope.pageIndex);
                    } else {
                        scope.pageCountBeforeCurrentIndex = Math.ceil(scope.settings.pageRange / 2) - 1;
                    }
                    //pages存的页码索引
                    scope.pages = [];
                    //currentIndex的前半部分
                    var pageIndex;
                    for (var i = 0; i < scope.pageCountBeforeCurrentIndex; i++) {
                        pageIndex = scope.pageIndex - (scope.pageCountBeforeCurrentIndex - i);
                        if (pageIndex >= 1) {
                            scope.pages.push(pageIndex);
                        }
                    }
                    //currentIndex
                    scope.pages.push(scope.pageIndex);

                    //currentIndex的后半部分
                    for (var j = 0; j < scope.pageCountAfterCurrentIndex; j++) {
                        pageIndex = scope.pageIndex + 1 + j;
                        if (pageIndex <= scope.pageCount) {
                            scope.pages.push(pageIndex);
                        }
                    }
                }

                initSettings();

                scope.$watch("pageModel.PageCount", function () {
                    if (!angular.isUndefined(scope.pageModel) && scope.pageModel.$promise) {
                        scope.pageModel.$promise.then(function () {
                            initSettings();
                            scope.pageCount = scope.pageModel.PageCount;
                            scope.totalCount = scope.pageModel.RecordCount;
                            scope.pageIndex = scope.pageModel.PageNumber;
                            scope.settings.pageSize = scope.pageModel.PageSize;
                            initPage();
                            scopeService.safeApply(scope);
                        });
                    }
                }, true);  //end watch pageModel

                //上一页
                scope.prevPage = function () {
                    if (scope.pageIndex > 1) {
                        scope.pageIndex--;
                        scope.changePage(scope.pageIndex);
                    }
                };

                //下一页
                scope.nextPage = function () {
                    if (scope.pageIndex < scope.pageCount) {
                        scope.pageIndex++;
                        scope.changePage(scope.pageIndex);
                    }
                };

                //翻页事件
                scope.changePage = function (pageIndex) {
                    scope.pageIndex = pageIndex;
                    if (!angular.isUndefined(scope.onPageChange)) {
                        scope.onPageChange(pageIndex);

                    }
                };

                initPage();

            }//end link
        };
    }]);
});

