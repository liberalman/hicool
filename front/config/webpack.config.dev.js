var utils = require('./utils')
var config = require('../config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var baseWebpackConfig = require('./webpack.base.conf')
var WebpackMerge = require('webpack-merge')
const WebpackCdnPlugin = require('webpack-cdn-plugin')

console.log(config)
module.exports = WebpackMerge(baseWebpackConfig, {
  // 模块：例如解读css，图片如何转换、压缩
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      chunksSortMode: 'none', //如果使用webpack4将该配置项设置为'none'
    }),
    new WebpackCdnPlugin({
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: 'dist/vue.min.js'
        },
        {
          name: 'vue-router',
          var: 'VueRouter',
          path: 'dist/vue-router.min.js'
        },
        {
          name: 'vuex',
          var: 'Vuex',
          path: 'dist/vuex.min.js'
        },
        {
          name: 'element-ui',
          var: 'ELEMENT',
          path: 'lib/index.js',
          style: 'lib/theme-chalk/index.css' // 引入样式文件
        },
        {
          name: 'axios',
          var: 'axios',
          path: 'dist/axios.min.js'
        },
      ],
      publicPath: '/node_modules'
    }),
  ],
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300, //防止重复保存频繁重新编译,300ms内重复保存不打包
    poll: 1000 //每秒询问的文件变更的次数
  },
  devServer: {
    inline: true,
    compress: true,
    host: config.dev.host,
    port: config.dev.port,
    historyApiFallback: true,
    proxy: config.dev.proxyTable //跨越设置，要先配置这里启用
  }
})
