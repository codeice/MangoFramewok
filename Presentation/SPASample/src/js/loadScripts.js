//加载所有引用的Js文件
define([
    './common/loadAllCommonScripts',
    './services/loadAllServiceScripts',
    './menuCtrl',
    './controllers/account/signinCtrl',

        //----选人插件
    './plugins/selectUser',

    //模块controller
    './controllers/home/homeCtrl',
    './controllers/demo/demoCtrl',
    './controllers/test/testCtrl'
], function () {

});
