var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var watch = require('gulp-watch');
var util = require('gulp-util');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-cssmin');
var spritesmith = require('gulp.spritesmith');
var gulpif = require('gulp-if');
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
    dest: './dist/www',
    src: './src',
    cordova: false,
    vendor: {
        js: ['./dist/www/lib/ionic/js/ionic.bundle.js'],
        css: ["./dist/www/lib/ionic/css/ionic.css"],
        fonts: ["./dist/www/lib/ionic/fonts/*"]
    }
};
//----原文件路径
var srcPath = {
    css: ['./src/css/*.css'],
    img: ['./src/img/*'],
    configjs: './src/js/**/*.js',
    js: ['./src/js/**/*.js', '!../src/js/**/config.js'],
    /*    js: ['./src/js/*#1#*.js'],*/
    html: ['./src/js/**/*.html'],
    indexHtml: ['./src/index.html']
};

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: config.dest,
        }
    });
    gulp.run('watch');
});

gulp.task('watch', function () {
    watch_source('img');
    watch(srcPath.css, { events: ['add', 'change'] }, function () {
        gulp.run('build-css');
    });
    watch(srcPath.js, { events: ['add', 'change'] }, function () {
        runSequence('build-bundlejs', 'build-index');
    });
    gulp.watch(srcPath.html, ['build-html']);
    gulp.watch(srcPath.index, ['build-index']);
});

//----监视文件夹变化
function watch_source(folder) {
    watch(path.join('./src', folder, "**/*"), { events: ['add', 'change'] }, function (changeInfo) {
        util.log('source=', changeInfo.path);
        util.log('dest=', path.join(config.dest));
        gulp.src(changeInfo.path)
            .pipe(gulp.dest(path.join(config.dest, folder)));
    });
}

//----build css
gulp.task('copy-fonts', function () {
    console.log("isProduct=", isProduct);
    var stream = gulp.src(config.vendor.fonts)
        .pipe(gulp.dest(config.dest + "/fonts"));
    return stream;
});

//----build css
gulp.task('build-css', ['copy-fonts'], function () {
    console.log("isProduct=", isProduct);
    var stream = gulp.src(srcPath.css)
        .pipe(gulpif(isProduct, cssmin().on('error', util.log)))
        .pipe(gulp.dest(path.join(config.dest, "css")))
        .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

//----build css
gulp.task('build-bundlecss', ['build-css'], function () {

    var stream = streamqueue({ objectMode: true },
            gulp.src(config.vendor.css),
            gulp.src(srcPath.css)
        )
        .pipe(cssmin().on('error', util.log))
        .pipe(concat('app.bundle.css').on('error', util.log))
        .pipe(gulp.dest(path.join(config.dest, "css")))
        .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

//---copy configjs 
gulp.task('copy-configjs', function () {
    var stream = gulp.src(srcPath.configjs)
        .pipe(gulp.dest(path.join(config.dest, "js")));
    return stream;
});

gulp.task('build-js', ['copy-configjs'], function () {
    console.log("isProduct=", isProduct);
    var stream = gulp.src(srcPath.js)
        .pipe(ngFilesort())
        .pipe(ngAnnotate())
        .pipe(gulpif(isProduct, uglify().on('error', util.log)))
        .pipe(gulp.dest(path.join(config.dest, "js")))
      .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

//----所有js链接成一个js
gulp.task('build-bundlejs', ['build-js'], function () {
    var stream = streamqueue({ objectMode: true },
            gulp.src(config.vendor.js),
            gulp.src(srcPath.js).pipe(ngFilesort())
        )
        .pipe(sourcemaps.init())
        .pipe(concat('app.bundle.js').on('error', util.log))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(config.dest, "js")));
    return stream;
});

gulp.task('build-img', function () {
    console.log("isProduct=", isProduct);
    var stream = gulp.src(srcPath.img)
        .pipe(gulp.dest(path.join(config.dest, "img")))
      .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

gulp.task('build-html', function () {
    console.log("isProduct=", isProduct);
    var stream = gulp.src(srcPath.html)
        .pipe(gulp.dest(path.join(config.dest, "js")));
    return stream;
});

//----css & js 注入index.html
gulp.task('build-index', ['build-bundlejs'], function () {
    var jsStream = "";
    var cssStream = "";
    if (isProduct) {
        //生产环境
        jsStream = gulp.src(config.dest + "/js/app.bundle.js");
        cssStream = gulp.src(config.dest + "/css/app.bundle.css");
    } else {
        //开发环境
        jsStream = streamqueue({ objectMode: true },
            gulp.src(config.vendor.js),
            gulp.src([config.dest + "/js/**/*.js", "!" + config.dest + "/js/**/config.js", "!" + config.dest + "/js/app.bundle.js"]).pipe(ngFilesort())
        );

        cssStream = streamqueue({ objectMode: true },
            gulp.src(config.vendor.css),
            gulp.src([config.dest + "/css/**/*.css", "!" + config.dest + "/css/app.bundle.css"])
        );
    }
    var stream = gulp.src(config.src + "/index.html")
        .pipe(inject(cssStream, {
            ignorePath: 'dist/www',
            addRootSlash: false,
            starttag: '<!-- inject:css -->'
        }))
        .pipe(inject(jsStream, {
            ignorePath: 'dist/www',
            addRootSlash: false,
            starttag: '<!-- inject:js -->'
        }))
        .pipe(gulp.dest(config.dest));
    return stream;
});


gulp.task('toggleToDev', function () {
    isProduct = false;
    console.log("切换到开发环境");
});

gulp.task('toggleToProduct', function () {
    isProduct = true;
    console.log("切换到生产环境 isProduct=", isProduct);
});

gulp.task('build', function () {
    runSequence('build-img', 'build-bundlecss', 'build-bundlejs', 'build-html', 'build-index');
});

//----开发环境
gulp.task('dev', function () {
    runSequence('serve', 'toggleToDev', 'build');
});

//----生产环境
gulp.task('product', function () {
    runSequence('serve', 'toggleToProduct', 'build');
});