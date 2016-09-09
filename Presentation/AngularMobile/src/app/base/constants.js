constants_v = '1.0.0';
//应用常量
(function () {
    var module = angular.module('app.constants', []);

    //----系统常量配置
    module.constant("platform", {
        from: 'WeChat',
        tokenLifetime: 43200, //token的生命周期
        platform: 'mobile'
    });

    //---手机短信事件
    module.constant("smsEvent", {
        // 发送注册验证码
        sendRegisterVCode: 0,
        //发送登录验证码
        sendLoginVCode: 1,
        // 发送重置密码验证码
        sendResetPwdVCode: 2,
        /// 发送修改密码验证码
        sendChangePwdVCode: 3,
        // 发送绑定手机号验证码
        sendBindMobileVCode: 4,
        // 发送重置后的密码
        sendResetedPwd: 9
    });

    //----正则表达式
    module.constant('patterns', {
        idCardNo: /^[1-9](\d{5})(((19\d{2})|2\d{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8])))|(([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229)(\d{3})([0-9]|X|x)$/,
        passport: /^([a-zA-Z]{5,17}|[a-zA-Z0-9]{5,17})$/,
        hkMacao: /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/,
        taiwan: /^([0-9]{8}|[0-9]{10})$/,
        studentNumber: /^[a-zA-Z0-9]{1,19}$/, //学籍号

        mobile: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
        phoneReg: /^[1][3-8]+\d{9}$/,
        email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9]+\.[A-Za-z]{2,4}$/,
        tel: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
        zhEn: /^[a-zA-Z\u4e00-\u9fa5]+$/, //中文英文
        zhEnChar: /^[a-zA-Z0-9@&-\.\u4e00-\u9fa5]+$/ //中文英文特殊字符(@&-.)
    });
})();