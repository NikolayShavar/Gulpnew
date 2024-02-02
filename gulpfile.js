const {src, dest, watch, parallel, series} = require('gulp');      //основной плагин, serias щтвечает за последовательность. 
const sass = require('gulp-sass')(require('sass'));        //плагин для стилей
const concat = require('gulp-concat')                      //плагин для переименований и минификаций файлов, еще он вроде объединять умеет. 
const uglify = require('gulp-uglify-es').default;          // плагин для js 
const browserSync = require('browser-sync').create();      // живой сервер, показывает изменения в браузере 
const rename = require('gulp-rename');                     // переименовыватель 
const autoprefixer = require('gulp-autoprefixer');         // автопрефиксер для древних браузеров
const clean = require('gulp-clean');                       //удаляет файлы
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const svgSprite = require('gulp-svg-sprite');
const include = require('gulp-include');

function pages() {
  return src('src/pages/*.html')
  .pipe(include({
    includePaths:'src/components'
  }))
  .pipe(dest('src'))
  .pipe(dest('app'))
  .pipe(browserSync.stream())
}

function fonts () {
  return src('src/fonts/*.*')
  .pipe(fonter({
    formats:['woff', 'ttf' ]
  }))

  .pipe(src('src/fonts/*.ttf'))
  .pipe(ttf2woff2())



 .pipe(dest('app/fonts'))

 

}


function sprite () {     // создаем спрайт svg и в app и в src 
return src('src/images/*.svg')
.pipe(svgSprite({
  mode: {
    stack: {
      sprite: '../sprite.svg',
      example: true
    }
  }
}))
.pipe(dest('app/images'))
.pipe(dest('src/images'))
}




function images() {     // уменьшатель картинок кроме svg
   return src(['src/images/*.*', '!src/images/*.svg'])
   .pipe(newer('app/images'))
   .pipe(avif({ qulity: 50 }))

  .pipe(src(['src/images/*.*', '!src/images/*.svg']))
  .pipe(newer('app/images'))
  .pipe(webp())

  .pipe(src(['src/images/*.*', '!src/images/*.svg']))
  .pipe(newer('app/images'))
  .pipe(imagemin())



   .pipe(dest('app/images'))
}


function watching() {            //СЛЕДИЛКА и Живой сервер
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
  watch(['src/sass/style.sass'], styles)
  watch(['src/images'], images)
  watch(['src/js/main.js'], scripts)
  watch(['src/components/*','app/pages/*' ], pages)
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
exports.images = images;
exports.sprite = sprite;
exports.fonts = fonts;
exports.pages = pages;


exports.clean = series(cleanapp, html, styles, scripts)
exports.default = parallel(html ,styles, scripts, images,pages, watching);