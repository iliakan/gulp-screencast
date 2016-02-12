'use strict';

const path = require('path');
const del = require('del');
const debug = require('gulp-debug');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const browserSync = require('browser-sync').create();
const resolver = require('stylus').resolver;
const svgSprite = require('gulp-svg-sprite');
const gulpIf = require('gulp-if');

gulp.task('styles', function() {

  return gulp.src('frontend/styles/index.styl')
      .pipe(sourcemaps.init())
      .pipe(stylus({
        import: process.cwd() + '/tmp/styles/sprite',
        define: {
          url: resolver()
        }
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('public/styles'));

});

gulp.task('clean', function() {
  return del(['public', 'tmp']);
});

gulp.task('assets', function() {
  return gulp.src('frontend/assets/**/*.*', {since: gulp.lastRun('assets')})
      .pipe(gulp.dest('public'));
});

gulp.task('styles:assets', function() {
  return gulp.src('frontend/styles/**/*.{png,jpg}', {since: gulp.lastRun('styles:assets')})
      .pipe(gulp.dest('public/styles'));
});

gulp.task('styles:svg', function() {
  return gulp.src('frontend/styles/**/*.svg')
      .pipe(svgSprite({
        mode: {
          css: {
            dest:       '.', // where to put style && sprite, default: 'css'
            bust:       false,
            sprite:     'sprite.svg', // filename for sprite relative to dest
            layout:     'vertical',
            prefix:     '$', // .svg-
            dimensions: true,
            render:     {
              styl: {
                dest: 'sprite.styl'  // filename for .styl relative to dest^
              }
            }
          }
        }
      }))
      .pipe(debug({title: 'styles:svg'}))
      .pipe(gulpIf('*.styl', gulp.dest('tmp/styles'), gulp.dest('public/styles')));
});


gulp.task('build', gulp.series('clean', 'styles:assets', 'styles:svg', 'styles', 'assets'));

gulp.task('watch', function() {
  gulp.watch(['frontend/styles/**/*.styl', 'tmp/styles/sprite.styl'], gulp.series('styles'));
  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
  gulp.watch('frontend/styles/**/*.{png,jpg}', gulp.series('styles:assets'));
  gulp.watch('frontend/styles/**/*.svg', gulp.series('styles:svg'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));