filters_v = '1.0.0';
(function () {
    var module = angular.module('app.filters', []);


    //----信任的url
    module.filter('trustUrl', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);


    //----信任的url
    module.filter('trustHtml', ['$sce', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        };
    }]);

    //启用禁用
    module.filter("enabled", [function () {
        return function (input) {
            if (input == null) {
                return "";
            }
            var ret = input ? "启用" : "禁用";
            return ret;
        };
    }]);

    //Boolean
    module.filter("boolean", [function () {
        return function (input) {
            if (input == null) {
                return "";
            }
            var ret = input ? "是" : "否";
            return ret;
        };
    }]);

})();