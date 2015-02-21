var _ = require('lodash');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var extend = require('util')._extend;
var fs = require('fs');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var pushState = require('connect-history-api-fallback');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

function getBundler(options) {
  var bundlerOptions = {
    entries: ['./client/app.js'],
    debug: true,
    extensions: ['.jsx']
  };

  var bundler = browserify(extend(bundlerOptions, options));

  // Browserify transforms
  bundler
    .transform('reactify')
    .transform('strictify')
    .transform('brfs');

  return bundler;
}

function bundle(bundler) {
  return bundler
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
      // Transformations
      // .pipe($.uglify({compress: false}))
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
  var bundler = getBundler();

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

gulp.task('html', function () {
  return gulp.src('./client/index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('revision-replace', function () {
  // Do not use require here because it will cache the contents.
  var manifest = JSON.parse(fs.readFileSync(__dirname + '/dist/js-rev-manifest.json'));
  extend(manifest, JSON.parse(fs.readFileSync(__dirname + '/dist/css-rev-manifest.json')));

  function replace(stream, key) {
    return stream.pipe($.replace(key, manifest[key]));
  }

  return Object.keys(manifest).reduce(replace, gulp.src('./dist/index.html'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('javascript', 'css', 'fonts', 'html'), 'revision-replace'));

// TODO
// gulp.task('test');

gulp.task('serve', gulp.series('build', function () {
  var clientConfig = require('./client-configuration');

  browserSync({
    server: {
      baseDir: 'dist',
      proxy: 'minimalms.org',
      middleware: [
        pushState,
        require('cookies').connect(),
        require('csurf')({ cookie: { httpOnly: true } }),
        function (request, response, next) {
          request.path = require('url').parse(request.url).path;
          next();
        },
        function (request, response, next) {
          if (request.path === '/index.html') {
            var config = _.extend({}, clientConfig, { csrf: request.csrfToken() });
            response.cookies.set('config', encodeURIComponent(JSON.stringify(config)), { httpOnly: false });
          }
          next();
        },
      ]
    }
  });

  function clean() {
    var args = Array.prototype.slice.call(arguments);

    return function (callback) {
      del.apply(null, args.concat(callback));
    }
  }

  gulp.watch('./dist/*-rev-manifest.json', gulp.series('html', 'revision-replace', reload));
  gulp.watch('./client/**/*.less', gulp.series(clean('./dist/*.css?(.map)'), 'css', 'html', 'revision-replace', reload));
  gulp.watch('./client/index.html', gulp.series('html', 'revision-replace', reload));

  var bundler = watchify(getBundler(watchify.args));

  bundler.on('update', function () {
    $.util.log($.util.colors.magenta('Updating javascript bundle'));
    del('./dist/*.js?(.map)');
    bundle(bundler);
  });

  return bundler.bundle();
}));

gulp.task('default', gulp.series('build'));
