'use strict';

const gulp = require('gulp');

module.exports = function(options) {

  return function() {
    return gulp.src(options.src, {since: gulp.lastRun(options.taskName)})
        .pipe(gulp.dest(options.dst));
  };

};
