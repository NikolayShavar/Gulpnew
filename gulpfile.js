const {src, dest, watch, parallel, serias} = require('gulp');      //основной плагин, serias щтвечает за последовательность. 
const sass = require('gulp-sass')(require('sass'));        //плагин для стилей
const concat = require('gulp-concat')                      //плагин для переименований и минификаций файлов, еще он вроде объединять умеет. 
const uglify = require('gulp-uglify-es').default;          // плагин для js 
const browserSync = require('browser-sync').create();      // живой сервер, показывает изменения в браузере 
const rename = require('gulp-rename');                     // переименовыватель 
const autoprefixer = require('gulp-autoprefixer');         // автопрефиксер для древних браузеров
const clean = require('gulp-clean');                       //удаляет файлы


function browsersync () {       //Живой сервер
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
}

function watching() {            //СЛЕДИЛКА
  watch(['src/sass/style.sass'], styles)
  watch(['src/js/main.js'], scripts)
  watch(['src/**/*.html']).on('change', browserSync.reload);
}

function scripts() {            //обработчик js
  return src('src/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}


function styles () {            //обработчик Стилей
  return src('src/sass/style.sass')
  .pipe(sass())
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version']}))
  .pipe(dest('src/css'))
  .pipe(sass({outputStyle: 'compressed' }))
  .pipe(rename('style.min.css'))
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())
}



function html () {            //перекидывает все html из src в app 
  return src('src/**/*.html')
  .pipe(dest('app/'))
}

function cleanapp() {
  return src('app')
  .pipe(clean())
}

// function build() {
//   return src ([
//     'app/css/style.min.css',
//     'app/js/main.min.js',
//     'app/**/*.html'
//   ], {base : 'app'})
//   .pipe(dest('dist'))
// }

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.cleanapp = cleanapp;

exports.default = parallel(html ,styles, scripts, browsersync, watching);