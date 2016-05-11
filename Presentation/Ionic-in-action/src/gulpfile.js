var gulp = require('gulp');
var gulputil = require('gulp-util');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var spritesmith = require('gulp.spritesmith');
var gulpif = require('gulp-if');
var runSequence = require('run-sequence');

//----生产环境不做压缩操作
var isProduct = false;

//----原文件路径
var srcPath = {
    css: ['../src/css/*.css'],
    img: ['../src/img/*.{png,jpg,jpeg}'],
    js: ['../src/js/**/*.js', '!../src/js/**/config.js'],
    html: ['../src/js/**/*.html'],
    indexHtml: ['../src/index.html']
};

//----目标文件路径
var distPath = {
    css: '../dist/www/css',
    img: '../dist/www/img',
    js: '../dist/www/js',
    html: '../dist/www/js',
    indexHtml: '../dist/www'
};


//----build css
gulp.task('build-css', function () {
    var stream = gulp.src(srcPath.css)
        .pipe(gulpif(isProduct, cssmin().on('error', gulputil.log)))
        .pipe(gulp.dest(distPath.css));
    return stream;
});

gulp.task('build-img', function () {
    var stream = gulp.src(srcPath.img)
    .pipe(gulp.dest(distPath.img));
    return stream;
});

gulp.task('build-js', function () {
    var stream = gulp.src(srcPath.js)
    .pipe(gulpif(isProduct, uglify().on('error', gulputil.log)))
    .pipe(gulp.dest(distPath.js));
    return stream;
});

gulp.task('build-html', function () {
    var stream = gulp.src(srcPath.html)
        .pipe(gulp.dest(distPath.html));
    return stream;
});

gulp.task('build-index', function () {
    var stream = gulp.src(srcPath.indexHtml)
        .pipe(gulp.dest(distPath.indexHtml));
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
    runSequence('toggleToDev', 'build-css', 'build-img', 'build-js', 'build-html', 'build-index');
});

//----生产环境
gulp.task('product', function () {
    runSequence('toggleToProduct', 'build-css', 'build-img', 'build-js', 'build-html', 'build-index');
});

