require.config({
    baseUrl: '',
    paths: {

        //jquery
        'jquery': 'libs/jquery/jquery-1.10.2.min',
        'jqueryui': 'libs/jquery/jquery-ui-1.10.3.full.min',
        'uploadify': 'libs/uploadify/jquery.uploadify.min',
        'blockui': 'libs/assets/js/jquery.blockUI',
        'zTree': 'libs/zTree/js/jquery.ztree.all-3.5',

        //bootstrap
        'bootstrap': 'libs/assets/js/bootstrap.min',
        'bootbox': 'libs/assets/js/bootbox',
        'datepicker': 'libs/assets/js/date-time/bootstrap-datepicker.min',
        'datepickerZh': 'libs/assets/js/date-time/locales/bootstrap-datepicker.zh-CN.min',
        'bootstrapTag': 'libs/assets/js/bootstrap-tag.min',

        //ace
        'aceExtra': 'libs/assets/js/ace-extra.min',
        'aceElement': 'libs/assets/js/ace-elements.min',
        'ace': 'libs/assets/js/ace.min',
        'acetree': 'libs/assets/js/fuelux/fuelux.tree.min',

        //angular
        'angular': 'libs/angular/angular',
        'angular-route': 'libs/angular-route/angular-route.min',
        'angular-ui-router': 'libs/angular-ui-router/angular-ui-router',
        'angular-batch': 'libs/angular-http-batcher/dist/angular-http-batch',

        //oauth
        'crypto': 'libs/oauth/crypto',
        'rsa': 'libs/oauth/rsa',
        'jsoneval': 'libs/oauth/json-sans-eval',
        'jws': 'libs/oauth/jws',
        'OAuthClient': 'libs/oauth/OAuthClient',
        ///////////////////应用模块/////////////////////
        //app
        'routes': 'app/routes'

    },
    shim: {
        //不符合AMD规范的js定义以及依赖关系配置
        'angular-route': { deps: ['angular'] },
        'angular-ui-router': { deps: ['angular'] },
        'angular-batch': { deps: ['angular'] },
        'angular': { deps: ['jquery'] },
        'jquery': { deps: [] },
        ace: {
            deps: ['aceExtra', 'aceElement']
        },
        aceElement: {
            deps: ['bootstrap', 'bootbox']
        },
        bootstrap: {
            deps: ['jquery']
        },
        jqueryui: {
            deps: ['jquery']
        },
        blockui: { deps: ['jquery'] },
        uploadify: { deps: ['jquery'] },
        bootbox: {
            deps: ['jquery', 'bootstrap']
        },
        datepicker: {
            deps: ['jquery', 'bootstrap']
        },
        datepickerZh: {
            deps: ['datepicker']
        },

        rsa: { deps: ['crypto'] },
        jws: {
            deps: ['jsoneval']
        },
        OAuthClient: {
            deps: ['rsa', 'jws']
        },
        zTree: { deps: ['jquery'] }
    },
    //开发环境使用，部署无需使用
    /* urlArgs: 'bust=13' + Math.random(),*/
    waitSeconds: 60
});

require(['routes'], function () {
    //ace 初始化程序
    $(function () {
        ace.handle_side_menu(jQuery);
        ace.enable_search_ahead(jQuery);
        ace.general_things(jQuery);
        ace.widget_boxes(jQuery);
        ace.widget_reload_handler(jQuery);
    });

    angular.bootstrap(document, ['app']);
});
