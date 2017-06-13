// Подключаем модули
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');

// Компилятор sass в css
gulp.task('sass', function(){
  return gulp.src('app/sass/main.scss')
  .pipe(sass())
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}));
});
// Минификация и сборка скриптов
gulp.task('scripts', function(){
  return gulp.src('app/lib/jquery/dist/jquery.min.js')
  .pipe(concat('lib.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'));
});
// Минификация css
gulp.task('css-libs', ['sass'], function(){
  return gulp.src('app/css/main.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
});
// Локальный сервер
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false,
    tunnel: 'blog'
  });
});
// Удаление папки dist для пересборки проекта
gulp.task('clean', function(){
  return del.sync('dist');
});
gulp.task('clear', function(){
  return cache.clearAll();
});
// Оптимизация картинок
gulp.task('img', function(){
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPLugins: [{removeViewBox: false}],
    une: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

// Livereload
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function(){
  gulp.watch('app/sass/main.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/*.js', browserSync.reload);
});
// Сборка проекта воедино
gulp.task('buld',['clean', 'img', 'sass', 'scripts'], function() {
  // Собираем css
  var buldCss = gulp.src([
    'app/css/main.min.css',
    'app/css/**/*',
  ])
  .pipe(gulp.dest('dist/css'));
  // Собираем шрифты
   var buldFonts = gulp.src('app/fonts/**/*')
   .pipe(gulp.dest('dist/fonts'));
  //  Собираем js
   var buldJS = gulp.src('app/js/**/*')
   .pipe(gulp.dest('dist/js'));
  //  Собираем HTML
   var buldHTML = gulp.src('app/*.html')
   .pipe(gulp.dest('dist'));
});
