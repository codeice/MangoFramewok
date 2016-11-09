//加载所有引用的Js文件
define([
    //----基本模块
    './app.main',

    //账号密码修改相关，不用请注释
    './account/accountCtrl',
    './account/accountService',

    //模块controller
    './home/homeCtrl',
    './demo/demoCtrl',
    './demo/demoService',
    './test/testCtrl'
], function () {

});
