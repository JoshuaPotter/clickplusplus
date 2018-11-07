var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
   return gulp.src('public/sass/*.scss')
     .pipe(sass({outputStyle: 'compressed'}))
     .pipe(gulp.dest('public/css'));
 });

gulp.task('watch', function() {
   gulp.watch('public/sass/*.scss', gulp.series('sass')); 
});