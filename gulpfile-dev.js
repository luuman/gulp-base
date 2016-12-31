var gulp = require('gulp'),
    // compass编译Sass, 生成雪碧图
    compass = require('gulp-compass'),
    // sass编译
    sass = require('gulp-sass'),
    // sass地图
    sourcemaps = require('gulp-sourcemaps'),
    // 重命名文件
    rename = require('gulp-rename'),
    // JS语法检测
    jshint = require('gulp-jshint'),
    // JS丑化
    uglify = require('gulp-uglify'),
    // JS拼接
    concat = require('gulp-concat'),
    // 图片压缩
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin'),
    // 缓存通知
    cache = require('gulp-cache'),
    // web服务
    connect = require('gulp-connect'),
    // 压缩CSS
    minifycss = require('gulp-minify-css'),
    // css文件引用URL加版本号
    cssver = require('gulp-make-css-url-version'),
    // 清空文件夹
    clean = require('gulp-clean'),
    // 更新通知
    notify = require('gulp-notify'),
    // 前端模版
    swig = require('gulp-swig'),
    // 生成带有哈希值的文件名
    rev = require('gulp-rev'),
    // html添加hash版本号
    revapp = require('gulp-rev-append'),
    // gulp-rev的插件，用于在生成带哈希值的文件名后替换html中的引用
    reCollector = require('gulp-rev-collector'),
    // 浏览器同步
    browserSync = require('browser-sync'),
    // 浏览器前缀
    autoprefixer = require('gulp-autoprefixer'),
    runSequence = require('run-sequence'),
    // 自动刷新
    reload = browserSync.reload,
    // 路径变量
    path = {
        // 开发环境
        src: {
            root: './src',
            js: './src/js',
            sass: './src/sass',
            image: './src/img',
            json: './src/json',
            fonts: './src/fonts'
        },
        // 发布环境
        dist: {
            root: './dist',
            js: './dist/js',
            css: './dist/css',
            image: './dist/img',
            json: './dist/json',
            fonts: './dist/fonts'
        },
        // 发布环境
        ver: {
            root: './ver',
            js: './ver/js',
            css: './ver/css',
            image: './ver/img',
            json: './ver/json',
            fonts: './ver/fonts'
        }
    };

// 编译Sass
gulp.task('sass',function(){
    return gulp.src(path.src.sass + '/*.scss' )
        .pipe(sass().on('error', sass.logError))
        // mobile
        .pipe(autoprefixer({
            browsers: [
                'iOS >= 7',
                'Android >= 2.0',
            ],
        }))
        // all
        // .pipe(autoprefixer(
        //   'last 2 version',
        //   'safari 5',
        //   'ie 8',
        //   'ie 9',
        //   'opera 12.1',
        //   'ios 6',
        //   'android 4'
        // ))
        .pipe(cssver())
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(rev())
        .pipe(gulp.dest(path.dist.css))
        .pipe(rev.manifest())
        .pipe(gulp.dest(path.ver.css))
        .pipe(reload({stream: true}))
        .pipe(notify({message:'sass -> <%= file.relative %>'}))
});

// image
gulp.task('image',function(){
    gulp.src(path.src.image+'/**/*.*')
        .pipe(cache(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        })))
        .pipe(reload({stream: true}))
        .pipe(notify({message:'imagesmin -> <%= file.relative %>'}))
        .pipe(rev())
        .pipe(gulp.dest(path.dist.image))
        .pipe(rev.manifest())
        .pipe(gulp.dest(path.ver.image))
})

// font icon
gulp.task('fonts',function(){
    gulp.src(path.src.fonts + '/**' )
        // 刷新的任务处
        .pipe(reload({stream: true}))
        .pipe(gulp.dest(path.dist.fonts))
        .pipe(notify({message:'fonts -> <%= file.relative %>'}))
});
gulp.task('json',function(){
    gulp.src(path.src.json + '/**/*.*')
        // 刷新的任务处
        .pipe(reload({stream: true}))
        .pipe(gulp.dest(path.dist.json))
        .pipe(notify({message:'json -> <%= file.relative %>'}))
});

// 合并压缩JS文件
gulp.task('minify',function(){
    gulp.src(path.src.js + '/*.js')
        // 压缩
        .pipe(uglify())
        // 重命名
        .pipe(rename({suffix: '.min'}))
        .pipe(reload({stream: true}))
        .pipe(notify({ message: '合并压缩JS文件' }))
        .pipe(rev())
        .pipe(gulp.dest(path.dist.js))
        .pipe(rev.manifest())
        .pipe(gulp.dest(path.ver.js))
});

gulp.task('dev',['gulprev'],function(){
    gulp.src(['./ver/**/*.json', './src/*.html'])
        .pipe(reCollector())
        .pipe(swig())
        .pipe(htmlmin({
            //清除HTML注释
            removeComments: true,
            //压缩HTML
            collapseWhitespace: true,
            //省略布尔属性的值 <input checked="true"/> ==> <input />
            collapseBooleanAttributes: true,
            //删除所有空格作属性值 <input id="" /> ==> <input />
            removeEmptyAttributes: true,
            //删除<script>的type="text/javascript"
            removeScriptTypeAttributes: true,
            //删除<style>和<link>的type="text/css"
            removeStyleLinkTypeAttributes: true,
            //压缩页面JS
            minifyJS: true,
            //压缩页面CSS
            minifyCSS: true
        }))
        .pipe( gulp.dest('dist/'))
});

gulp.task('gulprev',['sass', 'minify', 'image', 'fonts', 'json'],function(){
    gulp.src(['./dist/css/*.css'])
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('default', ['dev']);