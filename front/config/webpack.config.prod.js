var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const UselessFile = require('useless-files-webpack-plugin')
const WebpackCdnPlugin = require('webpack-cdn-plugin')

var env = process.env.NODE_ENV === 'testing' ?
  require('../config/test.env') :
  config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: false // extract(提取)为true的时候，用css-loader
      // 为false的时候，用vue-style-loader
      // 这里不能用true，参考下面正确的rules，要是用true，打包之后运行起来发现有部分样式丢失。
    })
    /*rules: [{
        test: /\.css$/,
        use: ['vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ]*/
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  externals: {
    // 左边是给 require用的, 右边是给全局调用的
    'axios': 'axios',
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vue-avatar': 'VueAvatar',
    'vue-baidu-map': 'VueBaiduMap',
    'vue-moment': 'vueMoment',
    'vuex': 'Vuex',
    // 'vue-lazyload': 'VueLazyload',
    'element-ui': 'ELEMENT',
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    /**
     * MiniCssExtractPlugin 插件用于将 css 从打包好的 js 文件中抽离，
     * 生成独立的 css 文件，想象一下，当你只是修改了下样式，并没有修改
     * 页面的功能逻辑，你肯定不希望你的 js 文件 hash 值变化，你肯定是
     * 希望 css 和 js 能够相互分开，且互不影响。
     */
    // contenthash 代表的是文本文件内容的 hash 值
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing' ?
        'index.html' : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunksSortMode: 'none', //如果使用webpack4将该配置项设置为'none'
    }),
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
          name: 'vue-cropper',
          var: 'VueCropper',
          path: 'dist/index.js'
        },
        {
          name: 'vuex',
          var: 'Vuex',
          path: 'dist/vuex.min.js'
        },
        {
          name: 'vue-avatar',
          var: 'VueAvatar',
          path: 'dist/vue-avatar.min.js'
        },
        {
          name: 'vue-baidu-map',
          var: 'VueBaiduMap',
          path: 'index.js'
        },
        {
          name: 'vue-moment',
          var: 'vueMoment',
          path: 'dist/vue-moment.js'
        },
        {
          name: 'element-ui',
          var: 'ELEMENT',
          path: 'lib/index.js',
          style: 'lib/theme-chalk/index.css' //插入样式文件
        },
        {
          name: 'axios',
          var: 'axios',
          path: 'dist/axios.min.js'
        },
        /*{
          name: 'highlight.js',
          var: 'highlight',
          prodUrl: '//cdn.bootcss.com/highlight.js/9.15.8/highlight.min.js'
        },*/
        {
          name: 'highlight.js/styles/github.css',
          cssOnly: true,
          prodUrl: '//cdn.bootcss.com/highlight.js/9.15.8/styles/github.min.css'
        },
        /*{
          name: '@iktakahiro/markdown-it-katex',
          var: 'katex',
          path: 'index.js',
        },*/
        {
          name: 'github-markdown-css/github-markdown.css',
          cssOnly: true,
          prodUrl: '//cdn.bootcss.com/github-markdown-css/3.0.1/github-markdown.css'
        },
        /*{
          name: 'markdown-it',
          var: 'markdown-it',
          prodUrl: '//cdn.bootcss.com/markdown-it/9.0.1/markdown-it.min.js'
        },*/
        /*{
          name: 'markdown-it-emoji',
          var: 'markdown-it-emoji',
          path: 'index.js',
        },*/
        {
          name: 'tinymce/tinymce',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/jquery.tinymce.min.js'
        },
        {
          name: 'tinymce/themes/silver',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/themes/silver/theme.min.js'
        },
        {
          name: 'tinymce/plugins/advlist',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/plugins/advlist/plugin.min.js'
        },
        {
          name: 'tinymce/plugins/link',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/plugins/link/plugin.min.js'
        },
        {
          name: 'tinymce/plugins/image',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/plugins/image/plugin.min.js'
        },
        {
          name: 'tinymce/plugins/code',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/plugins/code/plugin.min.js'
        },
        {
          name: 'tinymce/plugins/table',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/plugins/table/plugin.min.js'
        },
        {
          name: 'tinymce/plugins/textcolor',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/plugins/textcolor/plugin.min.js'
        },
        {
          name: 'tinymce/plugins/paste',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/plugins/paste/plugin.min.js'
        },
        {
          name: 'tinymce/plugins/textcolor',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/plugins/textcolor/plugin.min.js'
        },
        {
          name: 'tinymce/plugins/colorpicker',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/plugins/colorpicker/plugin.min.js'
        },
        {
          name: 'popmotion',
          var: 'popmotion',
          prodUrl: '//cdn.bootcss.com/popmotion/4.3.4/popmotion.global.min.js'
        },
      ],
      publicPath: '/node_modules'
    }),
    // copy custom static assets 拷贝图片
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }]),
    new UselessFile({
      root: './src', // 项目目录
      out: './fileList.json', // 输出文件列表
      clean: false, // 删除文件,
      exclude: path // 排除文件列表, 格式为文件路径数组
    }),
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
      name: "manifest" //runtimeChunk是webpack固定生成的一段代码，用来维护模块之间的依赖关系的，
      // 比如给每个模块一个ID之类的，这部分代码跟你写的代码完全没有关系，所以单独切割出来能够防止他的变化影响你自己的代码的hash变化
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
        /*markdownItVue: { // 分割第三方库
          name: 'markdownItVue',
          test: /[\\/]node_modules[\\/]markdown-it-vue[\\/]/,
          priority: 10  // 优先级要大于 vendors 不然会被打包进 vendors
        },*/
        mavonEditor: { // 分割第三方库
          name: 'mavonEditor',
          test: /[\\/]node_modules[\\/]mavon-editor[\\/]/,
          priority: 10  // 优先级要大于 vendors 不然会被打包进 vendors
        },
        public: { // 分割共用文件
          name: 'public',
          test: 'src/views/components',
          minSize: 0, //表示在压缩前的最小模块大小,默认值是 30kb
          minChunks: 2, // 最小公用次数
          priority: 5, // 优先级
          reuseExistingChunk: true // 公共模块必开启
        },
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
  },
})

if(config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换 成原查询字符
      algorithm: 'gzip',
      test: new RegExp( //压缩 js 与 css
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240, //只处理比这个值大的资源。按字节计
      minRatio: 0.8, //只有压缩率比这个值小的资源才会被处
      deleteOriginalAssets: true // 是否删除原始资产
    })
  )
}

if(config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: 8888
  }))
}

module.exports = webpackConfig
