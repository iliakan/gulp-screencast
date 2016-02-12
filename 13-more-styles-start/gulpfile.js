'use strict';

const path = require('path');
const del = require('del');
const debug = require('gulp-debug');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const browserSync = require('browser-sync').create();

gulp.task('styles', function() {

  return gulp.src('frontend/styles/index.styl')
      .pipe(sourcemaps.init())
      .pipe(stylus())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('public/styles'));
});

gulp.task('clean', function() {
  return del('public');
});

gulp.task('assets', function() {
  return gulp.src('frontend/assets/**/*.*', {since: gulp.lastRun('assets')})
      .pipe(gulp.dest('public'));
});

gulp.task('styles:assets', function() {
  return gulp.src('frontend/styles/**/*.{svg,png}', {since: gulp.lastRun('styles:assets')})
      .pipe(gulp.dest('public/styles'));
});


gulp.task('build', gulp.series('clean', 'styles:assets', 'styles', 'assets'));

gulp.task('watch', function() {
  gulp.watch('frontend/styles/**/*.styl', gulp.series('styles'));
  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
  gulp.watch('frontend/styles/**/*.{svg,png}', gulp.series('styles:assets'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));