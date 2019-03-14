/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {
    jsonp: {
      csrf: true,
    },
    security: {
      csrf: {
        enable: false
      }
    },
    mongoose: {
      client: {
        url: 'mongodb://localhost:27017/db',
        options: {
          useCreateIndex: true
        },
      },
    },
    oAuth2Server: {
      //debug: true,
      debug: appInfo.env === 'local',
      grants: ['password', 'refresh_token']
    },
    static: { // 配置静态文件请求
      prefix: '/',
    },
    graphql: {
      router: '/graphql',
      app: true, // 是否加载到app上，默认开启
      agent: false, // 是否加载到agent上，默认关闭
      graphiql: true, // 是否加载开发者工具graphiql，默认开启。路由同router字段。使用浏览器打开该可见。
      onPreGraphQL: function* (ctx) {}, // graphQL路由前的拦截器
      onPreGraphiQL: function* (ctx) {}, // 开发工具graphiQL路由前的拦截器，建议用于做权限操作（如只提供开发者使用）
    },
    oauth: {
      // match: '/graphql'
    },
    bodyParser: {
      jsonLimit: '5mb',
      formLimit: '6mb',
    },
    qiniu: {
      app_key: process.env.QINIU_APP_KEY || '',
      app_secret: process.env.QINIU_APP_SECRET || '',
      domain: process.env.QINIU_APP_DOMAIN || '', //七牛配置域名
      bucket: process.env.QINIU_APP_BUCKET || '', //七牛空间名称
      expire: 604800 // 七牛token过期时间，单位s。这里我默认7天过期。
    }
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'xxxxxxxxxxxxxxxxxxx'; // 此处改为你自己的 Cookie 安全字符串

  // add your middleware config here
  config.middleware = ['robot', 'gzip', 'errorHandler', 'graphql'];
  // config.middleware = ['robot', 'gzip', 'errorHandler'];
  config.robot = {
    ua: [
      /Baiduspider/i,
    ]
  };
  config.gzip = {
    threshold: 1024 // 小于 1k 的响应体不压缩
  };
  config.errorHandler = {
    match: '/api', // 只对 /api 前缀的 url 路径生效
  };

  // add your user config here
  const userConfig = {
    myAppName: 'hicool',
  };
  
  config.news = {
    pageSize: 5,
    serverUrl: 'https://hacker-news.firebaseio.com/v0',
  };
  
  // 添加 view 配置
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
      '.html': 'nunjucks',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
