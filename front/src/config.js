export const API_ROOT = (process.env.NODE_ENV === 'production')
  ? 'https://api.hicool.top:6011'
  : '' // 已加跨域代理头，注意仅支持GET请求

export const CookieDomain = (process.env.NODE_ENV === 'production')
  ? '.hicool.top'
: ''

// 七牛云的上传地址，根据自己所在地区选择
export const QINIU_UPLOAD_ADDR = (process.env.NODE_ENV === 'production')
  ? 'http://up-z0.qiniup.com/offical'
  : 'http://up-z0.qiniup.com/test'

// 这是七牛云空间的外链默认域名
export const QINIU_IMG_ADDR = (process.env.NODE_ENV === 'production')
  ? 'http://image.hicool.top'
  : 'http://image.hicool.top'

// 又拍云
export const UPYUN_UPLOAD_ADDR = (process.env.NODE_ENV === 'production')
  ? 'http://v0.api.upyun.com'
  : 'http://v0.api.upyun.com'

// 这是七牛云空间的外链默认域名
export const UPYUN_IMG_ADDR = (process.env.NODE_ENV === 'production')
  ? 'https://offical.b0.upaiyun.com'
  : 'https://offical.b0.upaiyun.com'
