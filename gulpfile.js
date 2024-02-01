const {src, dest, watch, parallel} = require('gulp'); //основной плагин
const sass = require('gulp-sass')(require('sass')); //плагин для стилей
const concat = require('gulp-concat')               //плагин для переименований и минификаций файлов, еще он вроде объединять умеет. 
const uglify = require('gulp-uglify-es').default;  // плагин для js 
const browserSync = require('browser-sync').create();// живой сервер, показывает изменения в браузере 
const rename = require('gulp-rename')// переименовыватель 



function browsersync () {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
}

function watching() {
  watch(['app/sass/style.sass'], styles)
  watch(['app/js/main.js'], scripts)
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

function scripts() {
  return src('src/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}


function styles () {
  return src('app/sass/style.sass')
  .pipe(sass())
  .pipe(dest('src/css'))
  .pipe(sass({outputStyle: 'compressed' }))
  .pipe(rename('style.min.css'))
  .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}



exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;


exports.default = parallel(styles, scripts, browsersync, watching);