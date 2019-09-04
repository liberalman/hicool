// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: { // yarn build 的时候会用到如下配置
    env: require('./prod.env'),
    port: 5000,
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false, // 默认情况是true（true代表打包环境是开发环境，可以进行调试；false表示生产环境，正式上线的，不生成.map文件）
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false, // 不能启用压缩，因为微信浏览器不支持gzip
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    //bundleAnalyzerReport: process.env.npm_config_report
    bundleAnalyzerReport: true
  },
  dev: {
    env: require('./dev.env'),
    host: 'localhost',
    port: 5001,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        //target: 'http://localhost:7001/api',
        target: 'http://www.hicool.top/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
