var gulp = require('gulp');
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
var connect = require('gulp-connect');

//----生产环境不做压缩操作
var isProduct = false;

var config = {
    dest: 'dist/www',
    src: 'src',
    server: {
        host: 'localhost',
        port: '8000'
    }
};
//----原文件路径
var srcPath = {
    css: ['src/css/*.css'],
    img: ['src/img/*.{png,jpg,jpeg}'],
    js: ['src/js/**/*.js', '!../src/js/**/config.js'],
    html: ['src/js/**/*.html'],
    indexHtml: ['src/index.html']
};

gulp.task('connect-dev', function () {
    connect.server({
        root: 'src',
        host: 'localhost',
        port: 8008,
        livereload: true
    });
});

gulp.task('connect-dist', function () {
    connect.server({
        root: 'dist/www',
        server: 'localhost',
        port: 8001,
        livereload: true
    });
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
        .pipe(gulp.dest(path.join(config.dest, "js")))
        .pipe(connect.reload());
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


gulp.task('watch-src', function () {
    gulp.watch(['./src/css/**/*'], ['build-css']);
    /* gulp.watch(srcPath.img, ['build-img']);
     gulp.watch(srcPath.js, ['build-js']);
     gulp.watch(srcPath.html, ['build-html']);
     gulp.watch(srcPath.index, ['build-index']);*/
});

/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/
gulp.task('livereload', function () {
    gulp.src(path.join(config.dest, '*.html'))
      .pipe(connect.reload());
});
gulp.task('watch-dist', function () {
    gulp.watch([config.dest + '/**/*'], ['livereload']);
});

//----开发环境
gulp.task('dev', function () {
    runSequence('toggleToDev', 'connect-dev', 'watch-src');
});

//----生产环境
gulp.task('product', function () {
    runSequence('toggleToProduct', 'connect-dist', 'build-css', 'build-img', 'build-js', 'build-html', 'build-index');
});

