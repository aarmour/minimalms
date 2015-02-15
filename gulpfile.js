var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var extend = require('util')._extend;
var fs = require('fs');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var pushState = require('connect-history-api-fallback');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

function bundle(bundler) {
  // Browserify transforms
  bundler
    .transform('reactify')
    .transform('strictify')
    .transform('brfs');

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

gulp.task('iconfont', function () {
  return gulp.src('./node_modules/material-design-icons/**/svg/production/*48px.svg')
    .pipe($.iconfont({
      fontName: 'md-icons',
      normalize: true
    }))
      .on('codepoints', function (codepoints) {
        var options = {
          glyphs: codepoints,
          generatedWarning: 'WARNING: this file is generated automatically. Changes made here will be overwritten.'
        };

        gulp.src('./client/less/md-icons.tpl')
          .pipe($.consolidate('lodash', options))
          .pipe($.rename('md-icons.less'))
          .pipe(gulp.dest('./client/less'));
      })
    .pipe(gulp.dest('./client/fonts'));
});

gulp.task('clean', function (callback) {
  del(['dist'], callback);
});

// TODO
// gulp.task('codestyle');

gulp.task('javascript', function () {
  var bundler = browserify({
    entries: ['./client/app.js'],
    debug: true,
    extensions: ['.jsx']
  });

  return bundle(bundler);
});

gulp.task('css', function () {
  return gulp.src('./client/less/app.less')
    .pipe($.sourcemaps.init())
    .pipe($.less())
      // Transformations
      .pipe($.autoprefixer({cascade: false, browsers: ['last 2 versions']}))
      .pipe($.minifyCss())
    .pipe($.rev())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe($.rev.manifest())
    .pipe($.rename('css-rev-manifest.json'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('fonts', function () {
  return gulp.src('./client/fonts/*.?(eot|svg|ttf|woff)')
    .pipe(gulp.dest('dist/fonts'));
});

// gulp.task('images', function () {

// });

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

gulp.task('build', gulp.series('clean', gulp.parallel('javascript', 'css', 'fonts'), 'revision-replace'));

// TODO
// gulp.task('test');

gulp.task('serve', gulp.series('build', function () {
  browserSync({
    server: {
      baseDir: 'dist',
      middleware: pushState
    }
  });

  gulp.watch(['./client/**/*.@(js|jsx|less|html)'], gulp.series('build', reload));
}));

gulp.task('default', gulp.series('build'));
