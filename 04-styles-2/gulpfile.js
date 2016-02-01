'use strict';

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function() {

  let pipeline = gulp.src('frontend/styles/main.styl');

  if (isDevelopment) {
    pipeline = pipeline.pipe(sourcemaps.init());
  }

  pipeline = pipeline
      .pipe(stylus());


  if (isDevelopment) {
    pipeline = pipeline.pipe(sourcemaps.write());
  }

  return pipeline
      .pipe(gulp.dest('public'));

});

