'use strict';

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const path = require('path');
const del = require('del');
const debug = require('gulp-debug');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const rev = require('gulp-rev');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const gulplog = require('gulplog');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const cssnano = require('gulp-cssnano');
const resolver = require('stylus').resolver;
const svgSprite = require('gulp-svg-sprite');

gulp.task('styles', function() {

  return gulp.src('frontend/styles/index.styl')
      .pipe(gulpIf(isDevelopment, sourcemaps.init()))
      .pipe(stylus({
        import: process.cwd() + '/tmp/styles/sprite.styl',
        define: {
          url: resolver()
        }
      }))
      .pipe(gulpIf(!isDevelopment, cssnano()))
      .pipe(gulpIf(isDevelopment, sourcemaps.write()))
      .pipe(gulpIf(!isDevelopment, rev()))
      .pipe(gulp.dest('public/styles'))
      .pipe(gulpIf(!isDevelopment, rev.manifest('css.json')))
      .pipe(gulpIf(!isDevelopment, gulp.dest('manifest')));

});

gulp.task('styles:svg', function() {
  return gulp.src('frontend/styles/**/*.svg', {since: gulp.lastRun('styles:svg')})
      .pipe(debug({title: 'styles:svg'}))
      .pipe(svgSprite({
        shape: {
          spacing: {
            padding: 30
          }
        },

        mode: {
          css: {
            dest:   '.', // where to put style && sprite, default: 'css'
            bust:   !isDevelopment,
            sprite: 'sprite.svg', // filename for sprite relative to dest
            layout: 'vertical',
            prefix: '$',
            render: {
              styl: {
                dest: 'sprite.styl'  // filename for .styl relative to dest^
              }
            }
          }
        }
      }))
      .pipe(gulpIf('*.styl', gulp.dest('tmp/styles'), gulp.dest('public/styles')))
      .pipe(debug({title: 'styles:svg:result'}));
});

gulp.task('clean', function() {
  return del('public');
});

gulp.task('assets', function() {
  return gulp.src('frontend/assets/**/*.*', {since: gulp.lastRun('assets')})
      .pipe(debug({title: 'assets'}))
      .pipe(gulp.dest('public'));
});


gulp.task('build', gulp.series(
    'clean',
    gulp.parallel(
        'assets',
        gulp.series('styles:svg', 'styles')
    )
));

gulp.task('watch', function() {
  gulp.watch('frontend/styles/**/*.styl', gulp.series('styles'));
  gulp.watch('tmp/styles/**/*.styl', gulp.series('styles'));

  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
  gulp.watch('frontend/styles/**/*.svg', gulp.series('styles:svg'));
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'public'
  });

  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'serve'))
);