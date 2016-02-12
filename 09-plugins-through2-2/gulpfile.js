'use strict';

const gulp = require('gulp');
const through2 = require('through2').obj;
const File = require('vinyl');

gulp.task('assets', function() {

  const mtimes = {};

  return gulp.src('frontend/assets/**/*.*')
      .pipe(through2(
          function(file, enc, callback) {
            mtimes[file.relative] = file.stat.mtime;
            callback(null, file);
          }
      ))
      .pipe(gulp.dest('public'))
      .pipe(through2(
          function(file, enc, callback) {
            callback();
          },
          function(callback) {
            let manifest = new File({
              // cwd base path contents
              contents: new Buffer(JSON.stringify(mtimes)),
              base:     process.cwd(),
              path:     process.cwd() + '/manifest.json'
            });
            this.push(manifest);
            callback();
          }
      ))
      .pipe(gulp.dest('.'));

});