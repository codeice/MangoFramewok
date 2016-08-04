define(['./baseModule'], function (module) {

    //启用禁用
    module.filter("Enabled", [function () {
        return function (input) {
            if (input == null) {
                return "";
            }
            var ret = input ? "启用" : "禁用";
            return ret;
        };
    }]);

    //Boolean
    module.filter("Boolean", [function () {
        return function (input) {
            if (input == null) {
                return "";
            }
            var ret = input ? "是" : "否";
            return ret;
        };
    }]);

    //性别
    module.filter("Gender", [function () {
        return function (input) {
            if (input == null) {
                return "";
            }
            var result = input == "1" ? "女" : "男";
            return result;
        }
    }]);

    //dateFormat
    module.filter("DateFormat", [function () {
        return function (input, format) {
            if (!input) {
                return input;
            }
            return utility.DateFormat(input, format);
        }
    }]);

});