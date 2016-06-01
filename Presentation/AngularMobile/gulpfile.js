var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var watch = require('gulp-watch');
var util = require('gulp-util');
//----文件清除
var rimraf = require('gulp-rimraf');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var spritesmith = require('gulp.spritesmith');
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

var config = {
    apiServer: "http://localhost/ce.webapi",
    cordova: false,
    dest: './dist',
    src: './src',
    less: {
        src: [
             './src/less/**/*.less'
        ],
        paths: [
            './src/less', './bower_components'
        ]
    },
    sourcePath: {
        img: ['./src/images/*'],
        configjs: './src/app/**/config.js',
        js: ['./src/app/**/*.js', '!../src/app/**/config.js'],
        html: ['./src/app/**/*.html'],
        indexHtml: ['./src/index.html']
    },
    libs: [
        './dist/libs/angular.js',
        './dist/libs/angular-route.js',
        './dist/libs/mobile-angular-ui.min.js',
        './dist/libs/mobile-angular-ui.gestures.min.js'
    ],
    vendor: {
        js: [
            './bower_components/angular/angular.js',
            './bower_components/angular-route/angular-route.js',
            /*     './bower_components/angular-ui-router/release/angular-ui-router.min.js',*/
            './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.min.js',
            './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.min.js'
        ],
        css: [
            './bower_components/mobile-angular-ui/dist/css/mobile-angular-ui-hover.min.css',
            './bower_components/mobile-angular-ui/dist/css/mobile-angular-ui-base.min.css',
            './bower_components/mobile-angular-ui/dist/css/mobile-angular-ui-desktop.min.css'
        ],
        fonts: [
            './bower_components/font-awesome/fonts/fontawesome-webfont.*'
        ]
    },
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
});

//----文件监视
gulp.task('watch', function () {
    //watch images
    watch(config.sourcePath.img, { events: ['add', 'change'] }, function () {
        gulp.run('build-img').on('change', reload);
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
    console.log("isProduct=", isProduct);
    var stream = gulp.src(config.sourcePath.img)
        .pipe(gulp.dest(path.join(config.dest, "images")));
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

//----build css
gulp.task('build-less', function () {
    var stream = gulp.src(config.less.src)
        .pipe(less({
            paths: config.less.paths.map(function (p) {
                return path.resolve(__dirname, p);
            })
        }).on('error', util.log))
        .pipe(gulpif(isProduct, cssmin()).on('error', util.log))
        .pipe(rename({ suffix: '.bundle' }))
        .pipe(gulp.dest(path.join(config.dest, "css")))
        .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

//---copy configjs 
gulp.task('copy-configjs', function () {
    var stream = gulp.src(path.join(config.src, "app/config.js"))
        .pipe(gulp.dest(path.join(config.dest, "app")));
    return stream;
});

//----build app js
gulp.task('build-js', ['copy-configjs'], function () {
    var stream = gulp.src(config.sourcePath.js)
        .pipe(ngFilesort())
        .pipe(ngAnnotate())
        .pipe(gulpif(isProduct, uglify().on('error', util.log)))
        .pipe(gulp.dest(path.join(config.dest, "app")))
        .pipe(reload({ stream: true }));
    return stream;
});

//----所有js链接成一个js
gulp.task('build-bundlejs', ['build-js'], function () {
    var stream = "";
    if (isProduct) {
        stream = streamqueue({ objectMode: true },
                gulp.src(config.vendor.js),
                gulp.src(config.sourcePath.js).pipe(ngFilesort())
            )
            .pipe(sourcemaps.init())
            .pipe(concat('app.bundle.js').on('error', util.log))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(path.join(config.dest, "app")));
    } else {
        stream = gulp.src(config.vendor.js)
       .pipe(gulp.dest(path.join(config.dest, "libs")));
    }
    return stream;
});

//----css & js 注入index.html
gulp.task('build-index', ['build-bundlejs'], function () {
    console.log("build-index isProduct", isProduct);
    var jsStream = "";
    var cssStream = gulp.src(config.dest + "/css/app.bundle.css");
    if (isProduct) {
        //生产环境
        jsStream = gulp.src(config.dest + "/app/app.bundle.js");
    } else {
        //开发环境
        jsStream = streamqueue({ objectMode: true },
            gulp.src(config.libs),
            gulp.src([config.dest + "/app/**/*.js", "!" + config.dest + "/app/**/config.js", "!" + config.dest + "/app/app.bundle.js"])
            .pipe(ngFilesort())
        );
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
        .pipe(reload({ stream: true }));//通过流的方式通知浏览器变更

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
    gulp.run('watch');
});

//----开发环境
gulp.task('dev', function () {
    runSequence('serve', 'toggleToDev', 'build');
});

//----生产环境
gulp.task('product', function () {
    runSequence('serve', 'toggleToProduct', 'build');
});
