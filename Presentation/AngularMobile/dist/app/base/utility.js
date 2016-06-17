//----UI object init
(function (window, $) {
    //check Zepto
    if (!$) {
        throw 'please include zepto first.';
    }
    window.UI = {
        boot: [],
        $body: $('body'),
        $doc: $(document),
        $win: $(window),
        $content: $('body').children('.app').length ? $('body').children('.app') : $('body'),
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

/*//----模块
(function (window, $) {
    window.Component = function (fn) {
        var UI = window.UI;
        if (!UI) return;
        fn(UI, $);
    };
})(window, Zepto);*/

//-----图片自适应容器
window.Component(function (UI, $) {
    UI.imageAdapt = function ($imgContainer) {
        var $img = $imgContainer.children('img');

        if (!$imgContainer.is('.no-square')) {
            $imgContainer.height($imgContainer.width());
        }
        else {
            if ($img.is('[data-src]')) {
                $imgContainer.css('height', '');
            }
        }
        if ($img.length > 0 && !$imgContainer.is('.fix-width')) {
            if ($img[0].height <= $imgContainer.height()) {
                $img.addClass('fix-height');
                $img.css('margin-left', '-' + (($img[0].width - $imgContainer.width()) / 2) + 'px');
                $img.css('margin-top', '');
            }
            if ($img[0].height > $imgContainer.height() || $img[0].width < $imgContainer.width()) {
                $img.removeClass('fix-height');
                $img.css('margin-left', '');
                $img.css('margin-top', '-' + (($img[0].height - $imgContainer.height()) / 2) + 'px');
            }
        }
    };

    UI.boot.push(function () {
        $('.img-container').each(function () {
            UI.imageAdapt($(this));
        });

        $(window).resize(function () {
            $('.img-container').each(function () {
                UI.imageAdapt($(this));
            });
        });
    });
});

//---图片延迟加载
window.Component(function (UI, $) {
    UI.lazyLoadImage = function ($content) {
        /*  $('.img-container:not(.loaded)').each(function () {
              var $imgContainer = $(this),
                  image = $imgContainer.children('img')[0],
                  newImage = new Image();
  
              if (image && $imgContainer.offset().top < $content.height() + $content.offset().top && $imgContainer.offset().top + $imgContainer.height() >= $content.offset().top) {
                  $(image).remove();
                  $imgContainer.addClass('loaded');
  
                  newImage.src = image.getAttribute('data-src');
                  newImage.alt = image.alt;
                  newImage.title = image.title;
                  newImage.className = image.className;
                  newImage.onload = function () {
                      UI.imageAdapt($(this).parent());
                  };
                  if ($imgContainer.is('.prepend')) {
                      $imgContainer.prepend(newImage);
                  } else {
                      $imgContainer.append(newImage);
                  }
              }
              if ($imgContainer.is('.empty')) {
                  UI.imageAdapt($imgContainer);
              }
          });*/
        $('.img-container').each(function () {
            var $imgContainer = $(this);
            var image = $imgContainer.children('img')[0];
            if ($imgContainer.offset().top < UI.$win.height() + UI.$win.scrollTop()) {
                var src = image.getAttribute('data-src');
                $(image).attr('src', src);
                //----图片加载的进行自适应裁剪
                $(image).onload = function () {
                    UI.imageAdapt($(this).parent());
                }
            }
        });
    };

    UI.boot.push(function () {
        UI.$win.scroll(function () {
            UI.lazyLoadImage(UI.$content);
        });

        UI.lazyLoadImage(UI.$content);
    });
});




