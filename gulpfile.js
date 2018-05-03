var gulp = require('gulp')

//編譯SASS
var sass = require('gulp-sass');
//自動判斷前措詞
var autoprefixer = require('gulp-autoprefixer');

var postcss = require('gulp-postcss');

//編譯出錯時不停止gulp
var plumber = require('gulp-plumber');

//編譯ES6
const babel = require('gulp-babel');

//把JS檔合併成一個
const concat = require('gulp-concat');

//將壓縮的js檔在未壓縮的位置標記出來
const sourcemaps = require('gulp-sourcemaps');

//找出bower載入的套件
var gulpMainBowerFiles = require('gulp-main-bower-files');

//載入順序
var order = require("gulp-order");

//建立伺服器
var browserSync =require('browser-sync').create();

//壓縮css
let cleanCSS = require('gulp-clean-css');

//壓縮js
var uglify = require('gulp-uglify');

//將public後的版本，上傳到github上並建立pages
var ghPages = require('gulp-gh-pages');

//設定gulp環境(ex:開發環境時，不壓縮檔案---發佈時，壓縮檔案)
var minimist = require('minimist');
var envOptions = {
    string:'env',
    default:{ env: 'develop' }
}
var options = minimist(process.argv.slice(2),envOptions)
console.log(options);

//判斷envOptions環境而選擇要執行甚麼 
var gulpif = require('gulp-if');
/* 
        在cmd中改變env值方法為 
        gulp 執行的方法名字 --env 改變的內容
    ex: gulp tranSass --env public   
*/

//刪除資料夾
var clean = require('gulp-clean');

//依序執行gulp方法
var gulpSequence = require('gulp-sequence');

//圖片壓縮
var imagemin = require('gulp-imagemin');

//gulp設定方法
gulp.task('clean', function () {
    return gulp.src(['./.tmp','./dist','./.publish'], {read: false})
        .pipe(clean());
});

gulp.task('copyhtml',function(){
    return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist/'))
})

gulp.task('tranSass', function () {
    return gulp.src(['./src/scss/**/*.scss','./node_modules/bootstrap/scss/bootstrap.scss'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        //以編譯成CSS
        .pipe(autoprefixer({
            browsers: ['last 2 version']
        }))
        .pipe(gulpif(options.env === "public" ,cleanCSS()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css/'))
        // browserSync功能，scss檔變動時自動刷新頁面
        // .pipe(browserSync.stream());
})

// gulp.task('tranPluginsSass', function () {
//     return gulp.src('./.tmp/vendors/**/*.scss')
//         .pipe(plumber())
//         .pipe(sass().on('error', sass.logError))
//         //以編譯成CSS
//         .pipe(autoprefixer({
//             browsers: ['last 2 version']
//         }))
//         .pipe(concat('plugins.css'))
//         .pipe(cleanCSS())
//         .pipe(gulp.dest('./dist/css/'))
// })

gulp.task('babel', () =>
    gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(concat('all.js'))
    .pipe(gulpif(options.env==='public',uglify({
        // 取消console.log
        compress:{
            drop_console: true
        }
    })))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'))
    //browserSync功能，js檔變動時自動刷新頁面
    // .pipe(browserSync.stream())
);

gulp.task('bower', function(){
        return gulp.src('./bower.json')
        .pipe(gulpMainBowerFiles({
            overrides:{
                bootstrap:{
                    main:[
                        './dist/js/bootstrap.js'
                        // './scss/**/*.scss',
                    ]
                }
            }
        }))
        .pipe(gulp.dest('./.tmp/vendors'));
    });
    
gulp.task('vendorJs',['bower'],function(){
    return gulp.src('./.tmp/vendors/**/*.js')
    .pipe(order([
        'jquery/**/**.js',
        'bootstrap/**/**.js'
    ]))
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('browser-sync',function(){
    browserSync.init({
        server:{
            baseDir:'./dist'
        }
    })
})

gulp.task('imagemin', function(){
    gulp.src('./src/images/*')
        .pipe(gulpif(options.env==="public",imagemin()))
        .pipe(gulp.dest('dist/images'))
})

gulp.task('public', function() {
    return gulp.src(['./dist/**/*'])
      .pipe(ghPages());
  });

gulp.task('watch', function () {
    //監控資料夾，有變動執行後面的function
    gulp.watch('./src/scss/**/*.scss', ['tranSass'])
    gulp.watch('./src/js/**/*.js', ['babel'])
    gulp.watch('src/**/*.html',['copyhtml'])
    gulp.watch('src/images/*',['imagemin'])
});

gulp.task('build', gulpSequence('clean','copyhtml','tranSass','babel','vendorJs','imagemin'))

gulp.task('default', ['copyhtml','tranSass','babel','vendorJs','imagemin','watch']);