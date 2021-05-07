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
const PrerenderSPAPlugin = require('prerender-spa-plugin')

const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

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
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: 'static/js/[name].[contenthash:8].js',
    //filename: utils.assetsPath('js/[name].[chunkhash].js'), //文件格式，文件名.文件哈希
    //chunkFilename: utils.assetsPath('js/[id].[chunkhash].js') //文件切割后的文件名称。这里的name对应的就是路由中引入文件时候的webpackChunkName
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
    new PrerenderSPAPlugin({
        // 生成文件的路径，也可以与webpakc打包的一致。
        // 下面这句话非常重要！！！
        // 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
        staticDir: path.join(__dirname, '../dist'),
        // 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
        routes: ['/', '/about', '/article'],
        // 这个很重要，如果没有配置这段，也不会进行预编译
        renderer: new Renderer({
            inject: {
                foo: 'bar'
            },
            headless: true, // Linux是没有图形界面的所有没有办法运行，所以此处不能设置为true，否则会报chrome无法启动
        })
    }),
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
      //filename: utils.assetsPath('static/css/[name].[contenthash:8].css')
      filename: 'static/css/[name].[contenthash:8].css'
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
          path: 'lib/index.js'
        },
        {
          name: 'axios',
          var: 'axios',
          path: 'dist/axios.min.js'
        },
        {
          name: 'katex', // @iktakahiro/markdown-it-katex依赖于此
          var: 'katex',
          path: 'dist/katex.min.js',
        },
        {
          name: 'markdown-it-emoji',
          var: 'markdownitEmoji',
          path: 'dist/markdown-it-emoji-light.min.js',
        },
        {
          name: 'gojs',
          var: 'Go',
          path: 'release/go.js'
        },
        {
          name: 'echarts',
          var: 'echarts',
          path: 'dist/echarts.min.js'
        },
        {
          name: 'mermaid',
          var: 'mermaid',
          path: 'dist/mermaid.min.js'
        },
        {
          name: 'mavon-editor',
          var: 'MavonEditor',
          path: 'dist/mavon-editor.js',
        },
        {
          name: 'unorm',
          var: 'unorm',
          path: 'lib/unorm.js',
        },
        {
          name: 'raphael',
          var: 'Raphael',
          path: 'raphael.min.js',
        },
        {
          name: 'crypto-js',
          var: 'CryptoJS',
          path: 'crypto-js.js',
        },
        {
          name: 'vue-waterfall-easy',
          var: 'vueWaterfallEasy',
          path: 'src/vue-waterfall-easy/script/vueWaterfallEasy.js',
        },
        {
          name: 'vue-social-captcha',
          var: 'Captcha',
          path: 'dist/vue-social-captcha.umd.min.js',
        },
        /******************** has version **************************************/
        { // markdown-it-highlight依赖highlight.js，两个都要安装
          name: 'highlight.js',
          var: 'hljs',
          prodUrl: '//cdn.bootcss.com/highlight.js/9.15.8/highlight.min.js'
        },
        /*{ // 这个方式不行，页面内容全没了
          name: 'highlight.js/lib/languages/yaml.js',
          var: 'yaml',
          prodUrl: '//cdn.bootcss.com/highlight.js/9.15.8/languages/yaml.min.js'
        },
        { // markdown-it-highlight依赖highlight.js，两个都要安装
          name: 'highlight.js/lib/languages/go.js',
          var: 'Go',
          prodUrl: '//cdn.bootcss.com/highlight.js/9.15.8/languages/go.min.js'
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
          name: 'github-markdown-css',
          cssOnly: true,
          prodUrl: '//cdn.bootcss.com/github-markdown-css/3.0.1/github-markdown.css'
        },
        {
          name: 'markdown-it',
          var: 'markdownit',
          prodUrl: '//cdn.bootcss.com/markdown-it/9.0.1/markdown-it.min.js'
        },
        {
          name: 'tinymce',
          var: 'tinymce',
          prodUrl: '//cdn.bootcss.com/tinymce/5.0.12/tinymce.min.js'
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
          name: 'popmotion',
          var: 'popmotion',
          prodUrl: '//cdn.bootcss.com/popmotion/4.3.4/popmotion.global.min.js'
        },
        {
          name: 'flowchart.js',
          var: 'flowchart',
          prodUrl: '//cdn.bootcss.com/flowchart/1.12.2/flowchart.min.js'
        },
        /*{
          name: 'emojione',
          var: 'emojioneList',
          path: 'lib/js/emojione.min.js'
        },
        {
          name: 'markdown-it-icons',
          var: 'module',
          path: 'dist/index.js',
          style: 'dist/index.css' //插入样式文件
        },*/
        /*{
          name: 'uslug',
          var: 'uslug',
          paths: ['lib/L.js', 'lib/M.js', 'lib/N.js'],
        },*/
      ],
      publicPath: '/node_modules'
    }),
    // copy custom static assets 拷贝图片，如果不拷贝，例如/static/img/background-1.png这种图片，后面会带一个随机后缀，没法指定地址了。
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }]),
    /*new UselessFile({
      root: './src', // 项目目录
      out: './fileList.json', // 输出文件列表
      clean: false, // 删除文件,
      exclude: path // 排除文件列表, 格式为文件路径数组
    }),*/
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
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
      test: new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'), //压缩 js 与 css
      algorithm: 'gzip',
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
