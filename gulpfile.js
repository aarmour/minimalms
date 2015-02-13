var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var extend = require('util')._extend;
var fs = require('fs');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

function bundle(bundler) {
  // Browserify transforms
  bundler.transform('strictify');

  return bundler
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
      // Transformations
      .pipe($.uglify())
    .pipe($.rev())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe($.rev.manifest())
    .pipe($.rename('js-rev-manifest.json'))
    .pipe(gulp.dest('./dist'));
}

gulp.task('clean', function (callback) {
  del(['dist'], callback);
});

// TODO
// gulp.task('codestyle');

gulp.task('javascript', function () {
  var bundler = browserify({
    entries: ['./client/app.js'],
    debug: true
  });

  return bundle(bundler);
});

gulp.task('css', function () {
  return gulp.src('./client/app.less')
    .pipe($.sourcemaps.init())
    .pipe($.less())
      // Transformations
      .pipe($.minifyCss())
    .pipe($.rev())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe($.rev.manifest())
    .pipe($.rename('css-rev-manifest.json'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('revision-replace', function () {
  // Do not use require here because it will cache the contents.
  var manifest = JSON.parse(fs.readFileSync(__dirname + '/dist/js-rev-manifest.json'));
  extend(manifest, JSON.parse(fs.readFileSync(__dirname + '/dist/css-rev-manifest.json')));

  function replace(stream, key) {
    return stream.pipe($.replace(key, manifest[key]));
  }

  return Object.keys(manifest).reduce(replace, gulp.src(['./client/index.html']))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('javascript', 'css'), 'revision-replace'));

// TODO
// gulp.task('test');

gulp.task('serve', gulp.series('build', function () {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch(['./client/**/*.@(js|less|html)'], gulp.series('build', reload));
}));

gulp.task('default', gulp.series('build'));
