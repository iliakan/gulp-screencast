'use strict';

const gulp = require('gulp');

function lazyRequireTask(taskName, path, options) {
  options = options || {};
  options.taskName = taskName;
  gulp.task(taskName, function(callback) {
    let task = require(path).call(this, options);

    return task(callback);
  });
}

lazyRequireTask('styles', './tasks/styles', {
  src: 'frontend/styles/main.styl'
});

lazyRequireTask('clean', './tasks/clean', {
  dst: 'public'
});


lazyRequireTask('assets', './tasks/assets', {
  src: 'frontend/assets/**',
  dst: 'public'
});


gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('styles', 'assets'))
);

gulp.task('watch', function() {
  gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));

  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
});

lazyRequireTask('serve', './tasks/serve', {
  src: 'public'
});


gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'serve'))
);

lazyRequireTask('lint', './tasks/lint', {
  cacheFilePath: process.cwd() + '/tmp/lintCache.json',
  src: 'frontend/**/*.js'
});