var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var gulputil = require('gulp-util');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var spritesmith = require('gulp.spritesmith');
var gulpif = require('gulp-if');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var path = require('path');

//----生产环境不做压缩操作
var isProduct = false;

var config = {
    dest: './dist/www',
    src: './src'
};
//----原文件路径
var srcPath = {
    css: ['./src/css/*.css'],
    img: ['./src/img/*.{png,jpg,jpeg}'],
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
    gulp.watch(srcPath.img, ['build-img']);
    gulp.watch(srcPath.js, ['build-js']);
    gulp.watch(srcPath.html).on('change', reload);
    gulp.watch(srcPath.index, ['build-index']);
});

//----build css
gulp.task('build-css', function () {
    var stream = gulp.src(srcPath.css)
        .pipe(gulpif(isProduct, cssmin().on('error', gulputil.log)))
        .pipe(gulp.dest(path.join(config.dest, "css")));
    return stream;
});

gulp.task('build-img', function () {
    var stream = gulp.src(srcPath.img)
    .pipe(gulp.dest(path.join(config.dest, "img")));
    return stream;
});

gulp.task('build-js', function () {
    var stream = gulp.src(srcPath.js)
    .pipe(gulpif(isProduct, uglify().on('error', gulputil.log)))
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
