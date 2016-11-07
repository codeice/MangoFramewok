var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var watch = require('gulp-watch');
var util = require('gulp-util');
var weinre = require('weinre');
//----文件清除
var rimraf = require('gulp-rimraf');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var path = require('path');
//Used in conjunction with gulp-inject to inject your AngularJS application files (scripts) in a correct order
var ngFilesort = require('gulp-angular-filesort');
//压缩ng js的时候，依赖注入的服务会被当做参数进行压缩
var ngAnnotate = require('gulp-ng-annotate');
var inject = require('gulp-inject');
var es = require('event-stream');
//-----让队列中的流一一进入管道以保证顺序
var streamqueue = require('streamqueue');

//----生产环境不做压缩操作
var isProduct = false;
var now = new Date();
var version = (now.getMonth() + 1).toString() + now.getDate().toString() + now.getHours().toString() + now.getMinutes().toString() + now.getSeconds().toString();
var appBundleCss = 'app.bundle-' + version + '.css';
var appBundleJs = 'app.bundle-' + version + '.js';
var config = {
    cordova: false,
    dest: './dist',
    src: './src',
    less: {
        app: ['./src/assets/less/**/app.less'],
        src: [
            './src/assets/less/**/*.less'
        ],
        paths: [
            './src/assets/less', './bower_components'
        ]
    },
    sourcePath: {
        icon: ['./src/assets/icons/*'],
        img: ['./src/assets/images/*'],
        js: ['./src/app/**/*.js', '!./src/app/base/config.js'],
        html: ['./src/app/**/*.html'],
        indexHtml: ['./src/index.html']
    },
    vendor: {
        less: [
            './bower_components/mobile-angular-ui/src/less/mobile-angular-ui-base.less',
            './bower_components/swiper/src/less/swiper.less'
        ],
        js: [
            './bower_components/zepto/zepto.min.js',
            './bower_components/angular/angular.js',
            './bower_components/angular-route/angular-route.min.js',
            './bower_components/angular-animate/angular-animate.min.js',
            './bower_components/angular-http-batcher/dist/angular-http-batch.min.js',
            './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.min.js',
            './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.min.js',
            './bower_components/swiper/dist/js/swiper.min.js'
        ],
        fonts: [
            './bower_components/font-awesome/fonts/fontawesome-webfont.*'
        ]
    },
    weinre: {
        httpPort: 8008,
        boundHost: '172.16.193.4',
        verbose: false,
        debug: false,
        readTimeout: 5,
        deathTimeout: 15
    }
};

//----Report Errors to Console        
gulp.on('error', function (e) {
    throw (e);
});

// -----Clean dest folder 
gulp.task('clean', function (cb) {
    return gulp.src([
          path.join(config.dest, 'index.html'),
          path.join(config.dest, 'images'),
          path.join(config.dest, 'css'),
          path.join(config.dest, 'app'),
          path.join(config.dest, 'fonts')
    ], { read: false })
       .pipe(rimraf());
});

//Start a web server    
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: config.dest,
        }
    });
    gulp.run('watch');
});

//----文件监视
gulp.task('watch', function () {
    //watch images
    watch(config.sourcePath.img, { events: ['add', 'change'] }, function () {
        gulp.run('build-img');
    });

    //watch component's html 
    watch(config.sourcePath.html, { events: ['add', 'change'] }, function () {
        gulp.run('build-html');
    });

    //watch less
    watch(config.less.src, { events: ['add', 'change'] }, function () {
        gulp.run('build-less');
    });
    //watch app js
    watch(config.sourcePath.js, { events: ['add', 'change'] }, function () {
        runSequence('build-bundlejs', 'build-index');
    });

    //watch index.html
    watch(config.sourcePath.indexHtml, { events: ['add', 'change'] }, function () {
        gulp.run('build-index');
    });
});

//----监视文件夹变化
/*function watch_source(folder) {
    watch(path.join('./src', folder, "*#1#*"), { events: ['add', 'change'] }, function (changeInfo) {
        util.log('source=', changeInfo.path);
        util.log('dest=', path.join(config.dest));
        gulp.src(changeInfo.path)
            .pipe(gulp.dest(path.join(config.dest, folder)));
    });
}*/

//----copy fonts
gulp.task('copy-fonts', function () {
    var stream = gulp.src(config.vendor.fonts)
        .pipe(gulp.dest(config.dest + "/fonts"));
    return stream;
});

//----build images
gulp.task('build-img', function () {
    var stream = gulp.src(config.sourcePath.img)
        .pipe(gulp.dest(path.join(config.dest, "images")))
       .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

gulp.task('build-html', function () {
    var stream = gulp.src(config.sourcePath.html)
        .pipe(gulp.dest(path.join(config.dest, "app")))
        .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

/*======================================================================
=            Compile, minify, mobilize less                         =
======================================================================*/

//-----第三方库编译连接
gulp.task('build-vendorjs', function () {
    var stream = streamqueue({ objectMode: true },
            gulp.src(config.vendor.js)
        )
        .pipe(sourcemaps.init())
        .pipe(uglify().on('error', util.log))
        .pipe(concat('vendor.bundle.js').on('error', util.log))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, "build")));
    return stream;
});

gulp.task('build-vendorcss', function () {
    var stream = gulp.src(config.vendor.less)
        .pipe(less({
            paths: config.less.paths.map(function (p) {
                return path.resolve(__dirname, p);
            })
        }).on('error', util.log))
        .pipe(sourcemaps.init())
        .pipe(cssmin().on('error', util.log))
        .pipe(concat('vendor.bundle.css')).on('error', util.log)
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, "css")))
        .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

//----build sprite icon
gulp.task('build-sprite', function () {
    var spriteData = gulp.src(config.sourcePath.icon)
        .pipe(spritesmith({
            imgPath: '../images/icon-sprite.png',
            imgName: 'icon-sprite.png',
            padding: 4,
            cssName: 'icon-sprite.less'
        }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
        .pipe(buffer())
        .pipe(imagemin().on('error', util.log))
        .pipe(gulp.dest("./src/assets/images"));

    var cssStream = spriteData.css
        .pipe(gulp.dest('./src/assets/less'));

    return merge(imgStream, cssStream);
});


//----清空css文件夹
gulp.task('clean-css', function () {
    return gulp.src([
      path.join(config.dest, 'css', '*.*'), "!" + config.dest + "/css/vendor.bundle.css", "!" + config.dest + "/css/vendor.bundle.css.map"
    ], { read: false })
   .pipe(rimraf());
});

//----build css
gulp.task('build-less', ['clean-css'], function () {
    var stream = gulp.src(config.less.app)
        .pipe(less({
            paths: config.less.paths.map(function (p) {
                return path.resolve(__dirname, p);
            })
        }).on('error', util.log))
        .pipe(sourcemaps.init())
        .pipe(gulpif(isProduct, cssmin()).on('error', util.log))
        .pipe(gulpif(isProduct, rename({ suffix: '.bundle-' + version })).on('error', util.log))
        .pipe(gulpif(isProduct == false, rename({ suffix: '.bundle' })).on('error', util.log))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(path.join(config.dest, "css")))
            .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

//----build app js
gulp.task('copy-appjs', function () {
    var stream = gulp.src(config.sourcePath.js)
        .pipe(ngFilesort())
        .pipe(ngAnnotate())
        .pipe(gulp.dest(path.join(config.dest, "app")))
        .pipe(reload({ stream: true }));
    return stream;
});


//----清空build文件夹下的app.bundle
gulp.task('clean-build', function () {
    return gulp.src([
            path.join(config.dest, 'build', '*.*'), "!" + config.dest + "/build/vendor.bundle.js", "!" + config.dest + "/build/vendor.bundle.js.map"
    ], { read: false })
        .pipe(rimraf());
});
//----所有app js链接成一个app.bundle.js
gulp.task('build-bundlejs', ['clean-build', 'copy-appjs'], function () {
    var stream = "";
    if (isProduct) {
        stream = streamqueue({ objectMode: true },
                gulp.src(config.sourcePath.js)
                .pipe(ngFilesort())
                .pipe(ngAnnotate())
            )
            .pipe(sourcemaps.init())
            .pipe(uglify().on('error', util.log))
            .pipe(concat(appBundleJs).on('error', util.log))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(path.join(config.dest, "build")));
    }
    return stream;
});

//----css & js 注入index.html
gulp.task('build-index', ['build-bundlejs'], function () {
    var cssStream = "";
    var jsStream = "";
    if (isProduct) {
        //生产环境
        jsStream = gulp.src(config.dest + "/build/" + appBundleJs);
        cssStream = gulp.src(config.dest + "/css/" + appBundleCss);
    } else {
        //开发环境
        jsStream = streamqueue({ objectMode: true },
            gulp.src([config.dest + "/app/**/*.js", "!" + config.dest + "/app/**/config.js"])
            .pipe(ngFilesort())
        );
        cssStream = gulp.src(config.dest + "/css/app.bundle.css");
    }
    var stream = gulp.src(config.src + "/index.html")
        .pipe(inject(cssStream, {
            ignorePath: 'dist',
            addRootSlash: false,
            starttag: '<!-- inject:css -->'
        }))
        .pipe(inject(jsStream, {
            ignorePath: 'dist',
            addRootSlash: false,
            starttag: '<!-- inject:js -->'
        }))
        .pipe(gulp.dest(config.dest))
        .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更

    return stream;
});

//---切换到开发环境
gulp.task('toggleToDev', function () {
    isProduct = false;
    console.log("切换到开发环境");
});

//----切换到线上
gulp.task('toggleToProduct', function () {
    isProduct = true;
    console.log("切换到生产环境 isProduct=", isProduct);
});

//---所有任务
gulp.task('build', function () {
    runSequence('build-img', 'copy-fonts', 'build-html', 'build-less', 'build-bundlejs', 'build-index');
});

//----开发环境
gulp.task('dev', function () {
    runSequence('serve', 'toggleToDev', 'build');
});

//----生产环境
gulp.task('product', function () {
    runSequence('serve', 'toggleToProduct', 'build');
});

gulp.task('weinre', function () {
    weinre.run(config.weinre);
});