var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
   return gulp.src('public/scss/*.scss')
     .pipe(sass({outputStyle: 'compressed'}))
     .pipe(gulp.dest('public/css'))
     .pipe(browserSync.stream());
 });

gulp.task('watch', ['sass'], function() {
  browserSync.init({
    proxy: "http://localhost:3000",
    port: 3001
  });
  gulp.watch('public/scss/*.scss', ['sass']); 
  gulp.watch("public/js/*.js").on('change', browserSync.reload);
  gulp.watch("public/*.html").on('change', browserSync.reload);
});