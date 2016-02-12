'use strict';

let gulp = require('gulp');
let through2 = require('through2').obj;

gulp.task('default', function(callback) {

  gulp.src('node_modules/**/*.*')
      .pipe(through2(
          function(file, enc, cb) {
            console.log(file.relative);
            cb(null, file);
          }
      ))
      .resume()
      .on('end', callback);

});
