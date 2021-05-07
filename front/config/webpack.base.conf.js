var path = require('path')
var utils = require('./utils')
var config = require('../config')
var webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
var isProduction = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath :
      config.dev.assetsPublicPath
  },
  resolve: { //导入的时候不用写拓展名
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: utils.cssLoaders({
            sourceMap: isProduction
              ? config.build.productionSourceMap
              : config.dev.cssSourceMap,
            extract: isProduction
          })
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10*1024,
          name: 'static/images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10*1024,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
    ]
  },
  plugins: [
    // 添加VueLoaderPlugin，以响应vue-loader
    new VueLoaderPlugin(),
  ],
}
