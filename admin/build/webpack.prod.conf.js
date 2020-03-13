'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackCdnPlugin = require('webpack-cdn-plugin')

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: false, // extract(提取)为true的时候，用css-loader
      // 为false的时候，用vue-style-loader
      usePostCSS: false
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  externals: {
    // 左边是给 require用的, 右边是给全局调用的
    //'axios': 'axios',
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunksSortMode: 'none' // webpack4 must be none
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new WebpackCdnPlugin({
      modules: [
      {
        name: 'vue', // name是我们在使用import或者require的时候，引入的包名称
        var: 'Vue', // var是引入包时候，内部的全局变量名
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
        name: 'ant-design-vue', // name是我们在使用import或者require的时候，引入的包名称
        var: 'antd', // var是引入包时候，内部的全局变量名
        path: 'dist/antd.min.js',
        style: 'dist/antd.min.css', // see in index.html
      },
      {
        name: 'axios',
        var: 'axios',
        path: 'dist/axios.min.js'
      },
      {
        name: '@antv/g2',
        var: 'G2',
        path: 'dist/g2.min.js'
      },
      {
        name: '@ant-design/icons/lib/dist.js',
        var: 'AntDesignIcons',
        path: 'lib/umd.js'
      },
      {
        name: '@antv/data-set',
        var: 'DataSet',
        path: 'dist/data-set.min.js'
      },
      {
        name: 'mockjs',
        var: 'Mock',
        path: 'dist/mock-min.js'
      },
      {
        name: 'pouchdb',
        var: 'PouchDB',
        path: 'dist/pouchdb.min.js'
      },
      {
        name: 'moment',
        var: 'moment',
        path: 'min/moment.min.js'
      },
      {
        name: 'lodash',
        var: '_',
        path: 'lodash.min.js'
      },
    ],
      publicPath: '/node_modules'
    })
  ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin() // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
      ],
      runtimeChunk: {
        name: "manifest"
      },
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
config.build.bundleAnalyzerReport=true
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
