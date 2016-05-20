var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var watch = require('gulp-watch');
var util = require('gulp-util');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var spritesmith = require('gulp.spritesmith');
var gulpif = require('gulp-if');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var path = require('path');
//Used in conjunction with gulp-inject to inject your AngularJS application files (scripts) in a correct order
var ngFilesort = require('gulp-angular-filesort');
/*var inject = require('gulp-inject');*/

//----生产环境不做压缩操作
var isProduct = false;

var config = {
    dest: './dist/www',
    src: './src'
};
//----原文件路径
var srcPath = {
    css: ['./src/css/*.css'],
    img: ['./src/img/*'],
    js: ['./src/js/**/*.js', '!../src/js/**/config.js'],
    html: ['./src/js/**/*.html'],
    indexHtml: ['./src/index.html']
};


gulp.task('serve', ['build-css', 'build-img', 'build-js', 'build-html', 'build-index'], function () {
    browserSync.init({
        server: {
            baseDir: config.dest,
        }
    });
    gulp.watch(srcPath.css, ['build-css']);
    /*    gulp.watch(srcPath.img, ['build-img']);*/
    watch_source('img');
    gulp.watch(srcPath.js, ['build-js']).on('change', reload);
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
    var stream = gulp.src(srcPath.css)
        .pipe(gulpif(isProduct, cssmin().on('error', util.log)))
        .pipe(gulp.dest(path.join(config.dest, "css")))
        .pipe(reload({ stream: true })); //通过流的方式通知浏览器变更
    return stream;
});

gulp.task('build-img', function () {
    var stream = gulp.src(srcPath.img)
    .pipe(gulp.dest(path.join(config.dest, "img")));
    return stream;
});

gulp.task('build-js', function () {
    var stream = gulp.src(srcPath.js)
        .pipe(ngFilesort())
    .pipe(gulpif(isProduct, uglify().on('error', util.log)))
    .pipe(gulp.dest(path.join(config.dest, "js")));
    return stream;
});

gulp.task('build-html', function () {
    var stream = gulp.src(srcPath.html)
        .pipe(gulp.dest(path.join(config.dest, "js")));
    return stream;
});

gulp.task('build-index', function () {
    var stream = gulp.src(srcPath.indexHtml)
        .pipe(gulp.dest(config.dest));
    return stream;
    /*    var sources = gulp.src(['./src/*#1#*.js'], { read: false });
        var stream = gulp.src(srcPath.indexHtml)
            .pipe(inject(sources))
        .pipe(gulp.dest(config.dest));
        return stream;*/
});

gulp.task('toggleToDev', function () {
    isProduct = false;
    console.log("切换到开发环境");
});

gulp.task('toggleToProduct', function () {
    isProduct = true;
    console.log("切换到生产环境");
});

//----开发环境
gulp.task('dev', function () {
    runSequence('toggleToDev', 'serve');
});

//----生产环境
gulp.task('product', function () {
    runSequence('toggleToProduct', 'serve');
});
