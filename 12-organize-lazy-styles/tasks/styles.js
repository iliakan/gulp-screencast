'use strict';

const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const combine = require('stream-combiner2').obj;

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {

  return function() {
    return combine(
        gulp.src(options.src),
        $.if(isDevelopment, $.sourcemaps.init()),
        $.stylus(),
        $.if(isDevelopment, $.sourcemaps.write()),
        gulp.dest('public')
    ).on('error', $.notify.onError());
  };

};
