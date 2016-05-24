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

//----生产环境不做压缩操作
var isProduct = false;

var config = {
    dest: './dist/www',
    src: './src',
    cordova: false
};
//----原文件路径
var srcPath = {
    css: ['./src/css/*.css'],
    img: ['./src/img/*'],
    /*        js: ['./src/js/*#1#*.js', '!../src/js/*#1#config.js'],*/
    js: ['./src/js/**/*.js'],
    html: ['./src/js/**/*.html'],
    indexHtml: ['./src/index.html']
};

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: config.dest,
        }
    });
    gulp.watch(srcPath.css, ['build-css']);
    watch_source('img');
    watch(srcPath.js, { events: ['add', 'change'] }, function () {
        runSequence('build-bundlejs', 'build-index');
    });
    /*    gulp.watch(srcPath.js, ['build-js', 'build-index']).on('change', reload);*/
    gulp.watch(srcPath.html, ['build-html']).on('change', reload);
    gulp.watch(srcPath.index, ['build-index']).on('change', reload);
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
gulp.task('build-css', function () {
    console.log("isProduct=", isProduct);
    var stream = gulp.src(srcPath.css)
        .pipe(gulpif(isProduct, cssmin().on('error', util.log)))
        .pipe(gulp.dest(path.join(config.dest, "css")))
        .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

gulp.task('build-img', function () {
    console.log("isProduct=", isProduct);
    var stream = gulp.src(srcPath.img)
        .pipe(gulp.dest(path.join(config.dest, "img")));
    return stream;
});

gulp.task('build-js', function () {
    console.log("isProduct=", isProduct);
    var stream = gulp.src(srcPath.js)
        .pipe(ngFilesort())
        .pipe(ngAnnotate())
        .pipe(gulpif(isProduct, uglify().on('error', util.log)))
        .pipe(gulp.dest(path.join(config.dest, "js")));
    return stream;
});

//----所有js链接成一个js
gulp.task('build-bundlejs', ['build-js'], function () {
    var stream = gulp.src(srcPath.js)
    .pipe(ngFilesort())
    .pipe(sourcemaps.init())
    .pipe(concat('app.bundle.js').on('error', util.log))
     .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(config.dest, "js")));
    return stream;
});

gulp.task('build-html', function () {
    console.log("isProduct=", isProduct);
    var stream = gulp.src(srcPath.html)
        .pipe(gulp.dest(path.join(config.dest, "js")));
    return stream;
});

/*gulp.task('build-index', function () {
    var stream = gulp.src(srcPath.indexHtml)
    .pipe(gulp.dest(config.dest));
    return stream;
});*/

gulp.task('build-index', ['build-bundlejs'], function () {
    console.log("isProduct=", isProduct);
    var sources = "";
    if (isProduct) {
        //生产环境
        sources = gulp.src(config.dest + "/js/app.bundle.js");
    } else {
        //开发环境
        sources = gulp.src([config.dest + "/js/**/*.js", "!" + config.dest + "/js/app.bundle.js"]).pipe(ngFilesort());
    }
    var stream = gulp.src(config.src + "/index.html")
        .pipe(inject(sources, {
            ignorePath: 'dist/www',
            addRootSlash: false,
            starttag: '<!-- inject:app:js -->'
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
    runSequence('build-css', 'build-img', 'build-bundlejs', 'build-html', 'build-index');
});

//----开发环境
gulp.task('dev', function () {
    runSequence('serve', 'toggleToDev', 'build');
});

//----生产环境
gulp.task('product', function () {
    runSequence('serve', 'toggleToProduct', 'build');
});
