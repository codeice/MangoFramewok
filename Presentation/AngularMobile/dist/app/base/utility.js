
util_v = '1.0.0';

//----cookieHelper
var cookieHelper = {
    setCookie: function (key, value, expSeconds) {
        var d = new Date();
        d.setTime(d.getTime() + (expSeconds * 1000));
        document.cookie = key + "=" + value + "; expires=" + d.toUTCString() + ";path=/";
    },

    getCookie: function (key) {
        var name = key + "=";
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.indexOf(name) == 0)
                return cookie.substring(name.length, cookie.length);
        }
        return "";
    },

    checkCookie: function (key) {
        if (cookieHelper.getCookie(key) == "") {
            return false;
        } else {
            return true;
        }
    },

    clearCookie: function (key) {
        cookieHelper.setCookie(key, "", -1);
    }
};


//---------------工具
var utility = {
    //获取URL参数值
    getQueryParameter: function (param) {
        var reg = new RegExp("(^|\\?|&)" + param + "=([^&]*)(\\s|&|$)", "i");
        if (reg.test(location.href))
            return unescape(RegExp.$2.replace(/\+/g, " "));
        return "";
    },

    //----iframe
    resizeIframe: function () {
        var ifm = document.getElementById('rule-ifm');
        var ifmHeight = ifm.contentDocument.body.scrollHeight;
        ifm.height = ifmHeight;
    }
}


//---移除 数组中的某项
Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index >= 0) {
        this.splice(index, 1);
    }
};

//----删除数组中的特定项
Array.prototype.removeRange = function (items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var index = this.indexOf(item);
        if (index >= 0) {
            this.splice(index, 1);
        }
    }
};
