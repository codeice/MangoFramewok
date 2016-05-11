define(['../modules/dirModule', 'jqGridcn'], function (module) {
    module.directive('dirGrid', ["oauthService", '$rootScope', function (oauthService, $rootScope) {
        return {
            restrict: 'A',
            scope: {
                gridConfig: '=?',
                navConfig: '=?'
            },
            link: function (scope, element, attrs) {

                var table = null;
                var pager = null;
                var initializingData = true;
                if (scope.gridConfig) {
                    var grid_selector = '#' + attrs.id + '_grid';
                    var pager_selector = '#' + attrs.id + '_pager';
                    var load_selector = '#load_' + attrs.id + '_grid';

                    scope.$watch('gridConfig.url', function (newValue, oldValue) {
                        element.children().empty();
                        table = angular.element('<table id="' + grid_selector.replace('#', '') + '"></table>');
                        element.append(table);
                        pager = angular.element('<div id="' + pager_selector.replace('#', '') + '"></div>');
                        element.append(pager);
                        if (angular.isUndefined(scope.gridConfig.url)) {
                            return;
                        }
                        scope.gridConfig.ajaxGridOptions = {
                            url: $rootScope.appConfig.apiServer + scope.gridConfig.url,

                            beforeSend: function (request) {
                                //若要登录，则请求带上bear token
                                request.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem('access_token'));
                                jQuery(load_selector).show();
                            },
                            error: function (xhr, status, error) {
                                if (xhr.status == 401) {
                                    var m_oauthService = new oauthService();
                                    m_oauthService.authorize();
                                }
                                else {
                                    alert(xhr.status);
                                }
                                jQuery(load_selector).hide();
                            }
                        };
                        scope.gridConfig.pager = pager_selector;
                        scope.gridConfig.loadComplete = function () {
                            var p = $(this).jqGrid("getGridParam");
                            p.curRowNum = 1;
                            var table = this;
                            setTimeout(function () {
                                updatePagerIcons(table);
                            }, 0);
                        };
                        jQuery(grid_selector).jqGrid(scope.gridConfig);
                        jQuery(grid_selector).jqGrid('navGrid', pager_selector, scope.navConfig);
                    });//end watch url

                    scope.$watchCollection('gridConfig.data', function (newValue, oldValue) { //如果datatype为local,则监视data
                        if (scope.gridConfig.datatype != 'local') {
                            return;
                        }
                        element.children().empty();
                        jQuery(grid_selector).jqGrid(scope.gridConfig);
                        jQuery(grid_selector).jqGrid('navGrid', pager_selector, scope.navConfig);
                        if (initializingData) {
                            jQuery(load_selector).show();
                            initializingData = false;
                        } else {
                            jQuery(load_selector).hide();
                        }
                    });//end watch data

                }

                function updatePagerIcons(table) {
                    var replacement =
                    {
                        'ui-icon-seek-first': 'icon-double-angle-left bigger-140',
                        'ui-icon-seek-prev': 'icon-angle-left bigger-140',
                        'ui-icon-seek-next': 'icon-angle-right bigger-140',
                        'ui-icon-seek-end': 'icon-double-angle-right bigger-140'
                    };
                    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
                        var icon = $(this);
                        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

                        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
                    });
                }
            }
        };
    }]);
});