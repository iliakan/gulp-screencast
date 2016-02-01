'use strict';

// gulp-remember

const gulp = require('gulp');
const debug = require('gulp-debug');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const remember = require('gulp-remember');
const cached = require('gulp-cached');
const path = require('path');

gulp.task('styles', function() {

  return gulp.src('frontend/styles/**/*.css')
      .pipe(cached('styles'))
      .pipe(autoprefixer())
      .pipe(remember('styles'))
      .pipe(concat('all.css'))
      .pipe(gulp.dest('public'));

});

gulp.task('watch', function() {

  gulp.watch('frontend/styles/**/*.css', gulp.series('styles')).on('unlink', function(filepath) {
    remember.forget('styles', path.resolve(filepath));
    delete cached.caches.styles[path.resolve(filepath)];
  });

});

gulp.task('dev', gulp.series('styles', 'watch'));