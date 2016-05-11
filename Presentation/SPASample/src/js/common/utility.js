/*
 * directive 1.0
 * 数组移除单个项目
 *从数组中移除一个匹配项目
 *window.utility
 */
(function () {

    //----日期格式化
    Date.prototype.format = function (format) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return format;
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

    //----[{Key:'',Value:''}] return key匹配到的item
    Array.prototype.getDicItem = function (itemKey) {
        for (var i = 0; i < this.length; i++) {
            var item = this[i];
            if (item.Key == itemKey) {
                return item;
            }
        }
        return null;
    }; //end getDicItem

    window.utility = {

        //----获取当前季度
        getCurrentQuarter: function () {
            var currentDate = new Date();
            var currentMonth = currentDate.getMonth() + 1;
            var currentQuarter;
            if (1 <= currentMonth && currentMonth <= 3) {
                currentQuarter = 1;
            } else if (4 <= currentMonth && currentMonth <= 6) {
                currentQuarter = 2;
            } else if (7 <= currentMonth && currentMonth <= 9) {
                currentQuarter = 3;
            } else if (10 <= currentMonth && currentMonth <= 12) {
                currentQuarter = 4;
            }
            return currentQuarter;
        },

        //----获取当前年份
        getCurrentYear: function () {
            var year = new Date().getFullYear();
            return year;
        },

        //----获取年份列表（年份默认取最近5年）
        //----startYear and endYear 可以为空，默认startYear=2011,endYear=nowYear
        getLatestYearList: function (startYear, endYear) {
            if (startYear == undefined || isNaN(startYear)) {
                startYear = 2011;
            }
            if (endYear == undefined || isNaN(endYear)) {
                endYear = new Date().getFullYear();
            }
            var yearList = [];
            for (var i = startYear; i <= endYear; i++) {
                yearList.push(i);
            }
            return yearList;
        },

        //----初始化tooltip
        initTooltip: function () {
            $('[data-rel=tooltip]').tooltip();
        },

        //----newGuid
        newGuid: function () {
            var guid = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    guid += "-";
            }
            return guid;
        },

        addScripts: function (src) {
            var script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.src = src;
            document.body.appendChild(script);
        }

    };//end appHelper

})();