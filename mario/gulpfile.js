"use strict";

/* параметры для gulp-autoprefixer */
var autoprefixerList = [
    'Chrome >= 45',
	'Firefox ESR',
	'Edge >= 12',
	'Explorer >= 10',
	'iOS >= 9',
	'Safari >= 9',
	'Android >= 4.4',
	'Opera >= 30'
];
/* пути к исходным файлам (src), к готовым файлам (web), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
    web: {
        html:  'web/',
        js:    'web/js/',
        css:   'web/css/',
        img:   'web/img/'
    },
    src: {
        html:  'src/*.html',
        js:    'src/js/**/*.js',
        style: 'src/style/main.scss',
        img:   'src/img/**/*.*'
    },
    watch: {
        html:  'src/**/*.html',
        js:    'src/js/**/*.js',
        css:   'src/style/**/*.scss',
        img:   'src/img/**/*.*'
    },
    clean:     './web'
};
/* настройки сервера */
var config = {
    server: {
        baseDir: './web'
    },
    notify: false
};

/* подключаем gulp и плагины */
var gulp = require('gulp'),  // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    del = require('del'); // плагин для удаления файлов и каталогов

/* задачи */

// запуск сервера
gulp.task('webserver', function () {
    webserver(config);
});

// сбор html
gulp.task('html:web', function () {
    gulp.src(path.src.html) // выбор всех html файлов по указанному пути
	.pipe(plumber()) // отслеживание ошибок
	.pipe(rigger()) // импорт вложений
	.pipe(gulp.dest(path.web.html)) // выкладывание готовых файлов
	.pipe(webserver.reload({stream: true})); // перезагрузка сервера
});

// сбор стилей
gulp.task('css:web', function () {
    gulp.src(path.src.style) // получим main.scss
	.pipe(plumber()) // для отслеживания ошибок
	.pipe(sourcemaps.init()) // инициализируем sourcemap
	.pipe(sass()) // scss -> css
	.pipe(autoprefixer({ // добавим префиксы
		browsers: autoprefixerList
	}))
	.pipe(cleanCSS()) // минимизируем CSS
	.pipe(sourcemaps.write('./')) // записываем sourcemap
	.pipe(gulp.dest(path.web.css)) // выгружаем в web
	.pipe(webserver.reload({stream: true})); // перезагрузим сервер
});

// сбор js
gulp.task('js:web', function () {
    gulp.src(path.src.js) // получим файл main.js
	// .pipe(plumber()) // для отслеживания ошибок
	// .pipe(rigger()) // импортируем все указанные файлы в main.js
    // .pipe(sourcemaps.init()) //инициализируем sourcemap
	// .pipe(uglify()) // минимизируем js
    // .pipe(sourcemaps.write('./')) //  записываем sourcemap
	.pipe(gulp.dest(path.web.js)) // положим готовый файл
	.pipe(webserver.reload({stream: true})); // перезагрузим сервер
});

//перенос картинок
gulp.task('image:web', function () {
    gulp.src(path.src.img) // путь с исходниками картинок
	.pipe(gulp.dest(path.web.img)); // выгрузка готовых файлов
});

// удаление каталога web 
gulp.task('clean:web', function () {
    del.sync(path.clean);
});

// очистка кэша
gulp.task('cache:clear', function () {
  cache.clearAll();
});

// сборка
gulp.task('web', [
    'clean:web',
    'html:web',
    'css:web',
    'js:web',
    'image:web'
]);

// запуск задач при изменении файлов
gulp.task('watch', function() {
    gulp.watch(path.watch.html, ['html:web']);
    gulp.watch(path.watch.css, ['css:web']);
    gulp.watch(path.watch.js, ['js:web']);
    gulp.watch(path.watch.img, ['image:web']);
});

// задача по умолчанию
gulp.task('default', [
    'clean:web',
    'web',
    'webserver',
    'watch'
]);