require('dotenv').config();
const gulp = require('gulp');
const connect = require('gulp-connect-php');
const browserSync = require('browser-sync');

/**
 * Browser Sync handling
 */
const phpConfig = {
  base: './public/web',
  router: './public/web/.ht.router.php'
};

gulp.task('connect:sync', function() {
  connect.server(phpConfig, function (){
    browserSync({
      proxy: '127.0.0.1:8000',
    });
  });
});

gulp.task("connect:reload", function(done) {
  browserSync.reload();
  done();
});

/**
 * PHP web server with browser-sync.
 */
const files = [
  './public/web/modules/custom/**/*.php',
  './public/web/themes/custom/campus/templates/**/*.twig'
];

gulp.task("php:watch", function() {
  gulp.watch(files, gulp.series("connect:reload"));
});

/**
 * JS handling
 */
const concat = require('gulp-concat');
const minify = require('gulp-minify');

gulp.task('js:compile', function() {
  return gulp.src(process.env.JS_SOURCE)
    .pipe(concat(process.env.JS_FILENAME))
    .pipe(minify())
    .pipe(gulp.dest(process.env.JS_DESTINATION));
});

gulp.task('js:watch', function() {
  gulp.watch(process.env.JS_SOURCE, gulp.series("js:compile", "connect:reload"));
});

/**
 * SCSS handling
 */
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const sassGlob = require('gulp-sass-glob');

// Use the package importer to import scss from node_modules into scss files.
const packageImporter = require('node-sass-package-importer');

const sassConfig = {
  outputStyle: process.env.SCSS_OUTPUT_STYLE,
  importer: packageImporter()
};

gulp.task('sass:compile', function () {
  return gulp.src(process.env.SCSS_SOURCE)
    .pipe(sassGlob())
    .pipe(sass(sassConfig).on('error', sass.logError))
    .pipe(gulp.dest(process.env.SCSS_DESTINATION));
});

gulp.task('sass:watch', function () {
  gulp.watch(process.env.SCSS_SOURCE, gulp.series("sass:compile", "connect:reload"));
});

gulp.task('watch', gulp.parallel("sass:watch", "js:watch", "php:watch"));
gulp.task('default', gulp.parallel("connect:sync", "watch"));
