'use strict';

/* параметры для gulp-autoprefixer */
const autoprefixerList = [
    'Chrome >= 45',
    'Firefox ESR',
    'Edge >= 12',
    'Explorer >= 10',
    'iOS >= 9',
    'Safari >= 9',
    'Android >= 4.4',
    'Opera >= 30',
];
/* пути к исходным файлам (src), к готовым файлам (web), а также к тем, за изменениями которых нужно наблюдать (watch) */
const path = {
    web: {
        js: 'web/js/',
        css: 'web/css/',
        img: 'web/img/',
        audio: 'web/audio/',
    },
    src: {
        js: 'src/js/**/*.js',
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*',
        audio: 'src/audio/**/*.*',
    },
    watch: {
        js: 'src/js/**/*.js',
        css: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        audio: 'web/audio/*.*',
    },
    clean: './web',
};

/* подключаем gulp и плагины */
const gulp = require('gulp'); // подключаем Gulp
const plumber = require('gulp-plumber'); // модуль для отслеживания ошибок
const sourcemaps = require('gulp-sourcemaps'); // модуль для генерации карты исходных файлов
const sass = require('gulp-sass'); // модуль для компиляции SASS (SCSS) в CSS
const autoprefixer = require('gulp-autoprefixer'); // модуль для автоматической установки автопрефиксов
const cleanCSS = require('gulp-clean-css'); // плагин для минимизации CSS
const cache = require('gulp-cache'); // модуль для кэширования
const del = require('del'); // плагин для удаления файлов и каталогов

// сбор стилей
gulp.task('css:web', function() {
    gulp.src(path.src.style) // получим main.scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer({ // добавим префиксы
            browsers: autoprefixerList,
        }))
        .pipe(cleanCSS()) // минимизируем CSS
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.web.css)); // выгружаем в web
});

// копирование js
gulp.task('js:web', function() {
    gulp.src(path.src.js) // получим файл main.js
        .pipe(gulp.dest(path.web.js)); // положим готовый файл
});

//перенос картинок
gulp.task('image:web', function() {
    gulp.src(path.src.img) // путь с исходниками картинок
        .pipe(gulp.dest(path.web.img)); // выгрузка готовых файлов
});

//перенос audio
gulp.task('audio:web', function() {
    gulp.src(path.src.audio) // путь с исходниками картинок
        .pipe(gulp.dest(path.web.audio)); // выгрузка готовых файлов
});

// удаление каталога web
gulp.task('clean:web', function() {
    del.sync(path.clean);
});

// очистка кэша
gulp.task('cache:clear', function() {
    cache.clearAll();
});

// сборка
gulp.task('web', [
    'clean:web',
    'css:web',
    'js:web',
    'image:web',
    'audio:web',
]);

// запуск задач при изменении файлов
gulp.task('watch', function() {
    gulp.watch(path.watch.css, ['css:web']);
    gulp.watch(path.watch.js, ['js:web']);
    gulp.watch(path.watch.img, ['image:web']);
    gulp.watch(path.watch.img, ['audio:web']);
});

// задача по умолчанию
gulp.task('default', [
    'clean:web',
    'web',
    'watch',
]);
