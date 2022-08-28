import gulp from 'gulp'
import imagemin from "gulp-imagemin"
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat'
import autoprefixer from 'gulp-autoprefixer'
import uglify from 'gulp-uglify'
import browserSync from 'browser-sync'
import del from 'del'
import imageminGifsicle from 'imagemin-gifsicle' 
import imageminJpegtran from 'imagemin-jpegtran'
import imageminOptipng from 'imagemin-optipng'
import imageminSvgo from 'imagemin-svgo'



const scss = gulpSass(dartSass);

// const { src, dest, watch, parallel} = 'gulp'
// const scss = require('gulp-sass')(require('sass'))
// const concat = 'gulp-concat'
// const autoprefixer = require('gulp-autoprefixer')
// const autoprefixer = 'gulp-autoprefixer'
// const uglify = require('gulp-uglify')
// const uglify = 'gulp-uglify'
// const imagemin = imagemin
// const browserSync = require('browser-sync').create()
const browserSync1 = browserSync.create()


export function browsersync() {
    browserSync1.init({
        server: {
            baseDir: 'app/'
        }
    })
}

export function cleanDist() {
    return del('dist')
}

export function styles() {
    return gulp.src('app/scss/**/*.scss')
    .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        grid: true
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync1.stream())
}

export function scripts() {
    return gulp.src([
        'app/js/main.js'
    ], {"allowEmpty": true})
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync1.stream())
}


export function images() {
    return gulp.src('app/images/**/*.*')
    .pipe(imagemin([
        imageminGifsicle({interlaced: true}),
        imageminJpegtran({quality: 75, progressive: true}),
        imageminOptipng({optimizationLevel: 5}),
        imageminSvgo()
    ]))
    .pipe(gulp.dest('dist/images'))
}

export function buildRes() {
    return gulp.src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js'
    ], {base: 'app'})
    .pipe(gulp.dest('dist'))
}


function watching() {
    gulp.watch(['app/scss/**/*.scss'], styles)
    gulp.watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
    gulp.watch(['app/**/*.html']).on('change', browserSync1.reload)
}




export { watching as watch }


const start = gulp.parallel(styles, scripts, browsersync, watching)

const gulpBuild = gulp.series(cleanDist, images, buildRes)

export function build(){
    return gulpBuild()
} 

export default start
// export build





// exports.styles = styles
// exports.scripts = scripts
// exports.browsersync = browsersync
// exports.watching = watching

// exports.default = parallel(styles, scripts, browsersync, watching)