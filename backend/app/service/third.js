// app/service/user.js
const Service = require('egg').Service;
const qiniu = require('qiniu')

let uptoken = null

class ThirdService extends Service {
  async qiniuToken() {
    if (!uptoken) {
      return this.qiniuRefreshToken()
    }
    let arr = uptoken.split("=:")
    var buff = new Buffer(arr[1], 'base64')
    let obj = JSON.parse(buff.toString())
    if (obj.deadline < Date.now()/1000) {
      return this.qiniuRefreshToken()
    }
    return uptoken
  }
  
  async qiniuRefreshToken() {
    const mac = new qiniu.auth.digest.Mac(this.config.qiniu.app_key, this.config.qiniu.app_secret)
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: this.config.qiniu.bucket,
      // 自定义上传回复凭证
      returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
      expires: this.config.qiniu.expire,
    })
    uptoken = await putPolicy.uploadToken(mac)
    return uptoken
  }
}
module.exports = ThirdService;