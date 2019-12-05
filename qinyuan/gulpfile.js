var gulp = require('gulp');
var clean = require('gulp-clean'); //清理文件或文件夹
var minify = require('gulp-uglify'); //- 压缩js；
// var babel = require("gulp-babel"); // es6=>es5
//var concat = require('gulp-concat');                            //- 多个文件合并为一个；
var minifyCss = require('gulp-clean-css'); //- 压缩CSS为一行；
var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var revAppend = require('gulp-rev-append'); //- 给URL自动添加MD5版本号
var revCollector = require('gulp-rev-collector'); //- 路径替换
var replace = require('gulp-replace'); //替换地址
var runSequence = require('gulp-run-sequence');
var revFormat = require('gulp-rev-format');
var revReplace = require('gulp-rev-replace');
var ngAnnotate = require('gulp-ng-annotate');
var ngmin = require('gulp-ngmin');
var stripDebug = require('gulp-strip-debug');

/*=====================清理构建目录==========================*/
gulp.task('clean', function() {
	return gulp.src('dist/', {
			read: false
		})
		.pipe(clean());
});

/*=====================copy其他静态资源文件==========================*/
gulp.task('copyfont', function() {
	return gulp.src(['src/font/*'])
		.pipe(gulp.dest('dist/font'))
});
gulp.task('copyimages', function() {
	return gulp.src(['src/images/*'])
		.pipe(gulp.dest('dist/images'))
});
gulp.task('copylay', function() {
	return gulp.src(['src/lay/**/*'])
		.pipe(gulp.dest('dist/lay'))
});
gulp.task('copypage', function() {
	return gulp.src(['src/pages/**/*'])
		.pipe(gulp.dest('dist/pages'))
});
gulp.task('copyhtml', function() {
	return gulp.src(['src/*.html'])
		.pipe(gulp.dest('dist'))
});
gulp.task('copycssimg', function() {
	return gulp.src(['src/css/img/*'])
		.pipe(gulp.dest('dist/css/img'))
});

/*=====================压缩js==========================*/
gulp.task('jsbusiness', function() {
	return gulp.src(['src/js/business/*.js']) // 匹配
		.pipe(ngAnnotate())
		.pipe(ngmin({
			dynamic: false
		})) //Pre-minify AngularJS apps with ngmin
		.pipe(minify())
		.pipe(rev())
		.pipe(gulp.dest('dist/js/business'))
		.pipe(rev.manifest())
		.pipe(gulp.dest("config/business"));
});
gulp.task('jscontrollers', function() {
	return gulp.src(['src/js/controllers/*.js']) // 匹配
		.pipe(ngAnnotate())
		.pipe(ngmin({
			dynamic: false
		})) //Pre-minify AngularJS apps with ngmin
		.pipe(minify())
		.pipe(rev())
		.pipe(gulp.dest('dist/js/controllers'))
		.pipe(rev.manifest())
		.pipe(gulp.dest("config/controllers"));
});
gulp.task('jsmove', function() {
	return gulp.src('src/js/dependency/**/*') // 匹配
		.pipe(gulp.dest('dist/js/dependency'))
});

/*=====================压缩css==========================*/
gulp.task('concat', function() {
	return gulp.src(['src/css/**/*.css']) // 匹配
		.pipe(minifyCss())
		.pipe(gulp.dest('dist/css'))
});

/*=====================路径替换==========================*/
gulp.task('update-versionjs', function() {
	return gulp.src(['config/**/*.json', 'src/*.html'])
		.pipe(revCollector({
			replaceReved: true,
		}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('build', function(done) {
	runSequence(
		['clean'],
		['copyfont', 'copyimages', 'copylay', 'copypage', 'copyhtml', 'copycssimg'],
		['jsbusiness', 'jscontrollers', 'jsmove'],
		['concat'],
		['update-versionjs'],
		done);
})