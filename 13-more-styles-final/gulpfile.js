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
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const combine = require('stream-combiner2').obj;
const fs = require('fs');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function() {

  let resolve = resolver();
  let manifest;
  if (!isDevelopment) {
    manifest = require('./manifest/assets.json');
  }

  function url(urlLiteral) {
    urlLiteral = resolve.call(this, urlLiteral);
    for (let asset in manifest) {
      if (urlLiteral.val == `url("${asset}")`) {
        urlLiteral.string = urlLiteral.val = `url("${manifest[asset]}")`;
      }
    }
    return urlLiteral;
  }

  url.options = resolve.options;
  url.raw = true;

  return gulp.src('frontend/styles/index.styl')
      .pipe(plumber({
        errorHandler: notify.onError(err => ({
          title: 'Styles',
          message: err.message
        }))
      }))
      .pipe(gulpIf(isDevelopment, sourcemaps.init()))
      .pipe(stylus({
        import: process.cwd() + '/tmp/styles/sprite',
        define: {
          url: url
        }
      }))
      .pipe(gulpIf(isDevelopment, sourcemaps.write()))
      .pipe(gulpIf(!isDevelopment, combine(cssnano(), rev())))
      .pipe(gulp.dest('public/styles'))
      .pipe(gulpIf(!isDevelopment, combine(rev.manifest('css.json'), gulp.dest('manifest'))));


});

gulp.task('clean', function() {
  return del(['public', 'tmp', 'manifest']);
});

gulp.task('assets', function() {
  return gulp.src('frontend/assets/**/*.*', {since: gulp.lastRun('assets')})
      .pipe(gulpIf(!isDevelopment, revReplace({
        manifest: gulp.src('manifest/css.json', {allowEmpty: true})
      })))
      .pipe(gulp.dest('public'));
});

gulp.task('styles:assets', function() {
  return gulp.src('frontend/styles/**/*.{png,jpg}', {since: gulp.lastRun('styles:assets')})
      .pipe(gulpIf(!isDevelopment, rev()))
      .pipe(gulp.dest('public/styles'))
      .pipe(gulpIf(!isDevelopment, combine(rev.manifest('assets.json'), gulp.dest('manifest'))));
});

gulp.task('styles:svg', function() {
  return gulp.src('frontend/styles/**/*.svg')
      .pipe(svgSprite({
        mode: {
          css: {
            dest:       '.', // where to put style && sprite, default: 'css'
            bust:       !isDevelopment,
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