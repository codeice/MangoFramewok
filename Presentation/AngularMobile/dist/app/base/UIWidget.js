//----UI object init
(function (window, $) {
    //check Zepto
    if (!$) {
        throw 'please include zepto first.';
    }
    window.UI = {
        //---无需参数的函数数组
        boot: [],
        $body: $('body'),
        $doc: $(document),
        $win: $(window),
        $content: $('body').children('.app-content').length ? $('body').children('.app-content') : $('body'),
        init: function () {
            this.boot.forEach(function (fn) {
                if ($.isFunction(fn)) {
                    fn();
                }
            });
        }
    };
    //---组件
    window.Component = function (fn) {
        var UI = window.UI;
        if (!UI) return;
        fn(UI, $);
    };

})(window, Zepto);

//-----关闭对话框
window.Component(function (UI, $) {
    UI.closeWidget = function (eleId) {
        var $ele = $('#' + eleId);
        $ele.removeClass('widget-show');
    }
    UI.boot.push(function () {
        $('[dialog-close]').each(function () {
            $(this).on('click', function () {
                UI.closeWidget($(this).attr('dialog-close'));
            });
        });
    });
});

//----tooltiip
window.Component(function (UI, $) {
    UI.toggleTooltip = function ($ele) {
        var $tooltip = $ele.next('.tooltip');
        if ($tooltip.hasClass('tooltip-show')) {
            $tooltip.removeClass('tooltip-show');
        } else {
            $tooltip.addClass('tooltip-show');
        }
    }
    UI.boot.push(function () {
        $('[data-tooltip]').each(function () {
            $(this).on('click', function () {
                UI.toggleTooltip($(this));
            });
        });
    });
});

//----animationEnd
/*
window.Component(function (UI, $) {
    UI.animationEnd = function ($ele) {
        $ele.on("webkitAnimationEnd", function () {
            console.log("hello");
            $ele.addClass('splash-screen-hide');
        });
    }
    UI.boot.push(function () {
        $('.splash-screen').each(function () {
            UI.animationEnd($(this));
        });
    });
});
*/
