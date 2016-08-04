//压缩配置文件
({
    baseUrl: '',
    paths: {
        //ace common js 
        'jquery': 'libs/jquery/jquery-1.10.2.min',
        'bootstrap': 'libs/assets/js/bootstrap.min',
        'bootbox': 'libs/assets/js/bootbox.min',
        'datepicker': 'libs/assets/js/date-time/bootstrap-datepicker.min',
        'jqueryui': 'libs/jquery/jquery-ui-1.10.3.full.min',
        'blockui': 'libs/assets/js/jquery.blockUI',
        'cookie': 'libs/jquery/jquery.cookie',
        'aceExtra': 'libs/assets/js/ace-extra.min',
        'aceElement': 'libs/assets/js/ace-elements.min',
        'bootstrapTag': 'libs/assets/js/bootstrap-tag.min',
        'ace': 'libs/assets/js/ace.min',
        'acetree': 'libs/assets/js/fuelux/fuelux.tree.min',
        //angular
        'angular': 'libs/angular/angular',
        'angular-route': 'libs/angular/angular-route',
        'angular-batch': 'libs/angular/angular-http-batch',
        'app': 'app/app',
        'routes': 'app/routes',
        //oauth
        'crypto': 'libs/oauth/crypto',
        'rsa': 'libs/oauth/rsa',
        'jsoneval': 'libs/oauth/json-sans-eval',
        'jws': 'libs/oauth/jws',
        'OAuthClient': 'libs/oauth/OAuthClient',

        'zTree': 'libs/zTree/js/jquery.ztree.all-3.5',
        'jqGrid': 'libs/assets/js/jqGrid/jquery.jqGrid',
        'jqGridcn': 'libs/assets/js/jqGrid/i18n/grid.locale-cn'
    },
    shim: {
        //不符合AMD规范的js定义以及依赖关系配置
        'angular-route': { deps: ['angular'] },
        'angular-batch': { deps: ['angular'] },
        'angular': { deps: ['jquery'] },
        'jquery': { deps: [] },

        ace: {
            deps: ['aceExtra', 'aceElement']
        },
        aceElement: {
            deps: ['bootstrap', 'jqueryui', 'bootbox']
        },
        bootstrap: {
            deps: ['jquery']
        },
        jqueryui: {
            deps: ['jquery']
        },
        bootbox: {
            deps: ['jquery', 'bootstrap']
        },
        datepicker: {
            deps: ['bootstrap', 'jquery']
        },
        acetree: {
            deps: ['ace', 'jquery']
        },

        rsa: { deps: ['crypto'] },
        jws: {
            deps: ['jsoneval']
        },
        OAuthClient: {
            deps: ['rsa', 'jws']
        },
        jqGrid: { deps: ['jquery'] },
        jqGridcn: { deps: ['jqGrid'] },
        blockui: { deps: ['jquery'] },
        zTree: { deps: ['angular', 'jquery'] }
    },
    optimize: "uglify", //uglify 或者None
    name: "js/main",  //指定入口 函数
    out: 'app/all.js'  //压缩完的输出函数
})
