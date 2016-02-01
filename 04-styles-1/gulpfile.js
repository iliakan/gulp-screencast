'use strict';

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const debug = require('gulp-debug');

gulp.task('styles', function() {

  return gulp.src('frontend/**/*.styl')
      .pipe(debug({title: 'src'}))
      .pipe(stylus())
      .pipe(debug({title: 'stylus'}))
      .pipe(concat('all.css'))
      .pipe(debug({title: 'concat'}))
      .pipe(gulp.dest('public'));

});

