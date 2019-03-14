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
      csrf: false,
    },
    security: {
      csrf: {
        ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
      }
    }
  };
  
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + ''; // 此处改为你自己的 Cookie 安全字符串
  
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    mongoose: {
      client: {
        url: '',
        options: {},
      }
    },
    qiniu: {
      app_key: process.env.QINIU_APP_KEY || '',
      app_secret: process.env.QINIU_APP_SECRET || '',
      domain: process.env.QINIU_APP_DOMAIN || '', //七牛配置域名
      bucket: process.env.QINIU_APP_BUCKET || '' //七牛空间名称
    }
  };
  
  return {
    ...config,
    ...userConfig,
  };
};
