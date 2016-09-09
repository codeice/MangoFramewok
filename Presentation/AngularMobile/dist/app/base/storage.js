var v_storage = "v_1.0.0";
var v_storage = "v_1.0.0";
var storage = (function (win) {
    var keyPrefix = "localStorage_",
        keyReg = new RegExp(/^localStorage_\_.+$/);

    //key的存储格式 ls_XX;
    function getLocalKey(key) {
        var localKey = keyPrefix + key;
        return localKey;
    }

    //----是否过期(expires 时间)
    function isExpires(key, expiresTimestamp) {
        var nowTimestamp = new Date().getTime();
        if (!expires) {
            return false;
        }
        if (expiresTimestamp - nowTimestamp <= 0) {
            return true;
        }
        return false;
    }

    //----设置项（expireMinutes 过期分钟数）
    function setItem(key, value, expireSeconds) {
        if (!key) {
            return this;
        }
        expireSeconds = expireSeconds || 0;
        var localKey = getLocalKey(key),
          epxireTimestamp = expireSeconds ? expireSeconds * 1000 + new Date().getTime() : "";
        var item = {
            "key": key,
            "value": value,
            "expires": epxireTimestamp
        };
        win.localStorage.setItem(localKey, JSON.stringify(item));
        this._key = key;
        return this;
    }

    //---获取项
    function getItem(key) {
        var loacalKey = getLocalKey(key);
        var objStr = win.localStorage[loacalKey];
        if (objStr == undefined) {
            return "";
        }
        var item = JSON.parse(objStr);
        if (item) {
            // 如果过期则删除缓存并返回空字符串
            if (isExpires(loacalKey, item['expires'])) {
                this.removeItem(key);
                return "";
            }
            return item;
        }
        return "";
    }

    //----移除项
    function removeItem(key) {
        var localKey = getLocalKey(key);
        if (win.localStorage[localKey] == undefined) {
            return;
        }
        var item = JSON.parse(win.localStorage[localKey]);
        if (item) {
            win.localStorage.removeItem(localKey);
        }
        return this;
    }

    //----清空所有项
    function clear() {
        for (var key in win.localStorage) {
            if (keyReg.test(key)) {
                win.localStorage.removeItem(key);
            }
        }
        return this;
    }

    //----设置某项过期时间
    function expires(minutes) {
        if (!minutes) {
            return this;
        }
        var key = this._key;
        if (!key) {
            return this;
        }
        var localKey = getLocalKey(key);
        var item = JSON.parse(win.localStorage[localKey]),
            value = item["value"];

        this.removeItem(key);
        this.setItem(key, value, minutes);
        return this;
    }

    return {
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        clear: clear,
        expires: expires
    }

})(window);