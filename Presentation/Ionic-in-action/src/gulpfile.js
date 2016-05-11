var gulp = require('gulp');
var gulputil = require('gulp-util');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var spritesmith = require('gulp.spritesmith');
var gulpif = require('gulp-if');
var runSequence = require('run-sequence');

//----生产环境不做压缩操作
var isProduct = false;

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
    runSequence('toggleToDev');
});

//----生产环境
gulp.task('product', function () {
    runSequence('toggleToProduct');
});