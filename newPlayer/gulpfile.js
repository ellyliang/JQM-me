var gulp = require('gulp');
var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');
var named = require('vinyl-named');

// 记得要配版本号

gulp.task('dev', function() {
    return gulp.src('app/scripts/app.jsx')
        .pipe(named())
        .pipe(gulpWebpack({
            watch : true,
            module: {
              loaders: [
                {
                  test: /\.j(s|sx)$/,
                  exclude: /node_modules/,
                  loader: 'babel',
                  query: {
                      presets: ['es2015', 'react']
                  },
                },
                {
                  test: /\.scss$/,
                  exclude: /node_modules/,
                  loaders: ['style', 'css', 'sass']
                },
                {
                  test   : /\.woff|\.woff2|\.svg|.eot|\.ttf|\.png/,
                  loader : 'url?prefix=font/&limit=10000'
                }
              ],
              noParse: /commonmark\.js$/
            },
            output : {
                filename : '[name].js',
            }
        }))
        .pipe(gulp.dest('app/bulid/'));
});

gulp.task('package', function() {
    return gulp.src('app/scripts/app.jsx')
        .pipe(named())
        .pipe(gulpWebpack({
            module: {
              loaders: [
                {
                  test: /\.jsx?$/,
                  exclude: /node_modules/,
                  loader: 'babel',
                  query: {
                      presets: ['es2015', 'react']
                  }
                },
                {
                  test: /\.scss$/,
                  exclude: /node_modules/,
                  loaders: ['style', 'css', 'sass']
                },
                {
                  test   : /\.woff|\.woff2|\.svg|.eot|\.ttf|\.png/,
                  loader : 'url?prefix=font/&limit=10000'
                }
              ]
            },
            output : {
                filename : '[name].js',
            },
            devtool : '#source-map',
            plugins:[new webpack.optimize.UglifyJsPlugin('*.js')] // 本地开发时，可以暂不开启
        }))
        .pipe(gulp.dest('app/bulid/'));
});

gulp.task('default', ['dev']);
