// app/service/user.js
const Service = require('egg').Service;
const tools = require('../extend/tools')
const qiniu = require('qiniu')

let uptoken = null
let _marker = ''

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


  ////////// DELETE ///////////////
  /**
     * 异步调用函数,注意：要求第一个参数回调函数
     * @static
     * @param {function} paramFunc 要调用的函数
     * @param {...args} args 要调用的参数
     * @return {...args} 返回回调函数的传入参数列表
     */
  async CallbackListPrefix(paramFunc, ...args) {
    return new Promise((resolve) => {
      paramFunc((...result) => {
        resolve(result);
      }, ...args);
    });
  }

  async deleteImage(prefix) {
    prefix = 'hicool/articles/'
    let _this = this
    var mac = new qiniu.auth.digest.Mac(this.config.qiniu.app_key, this.config.qiniu.app_secret);
    var config = new qiniu.conf.Config();
    //config.useHttpsDomain = true;
    config.zone = qiniu.zone.Zone_z0;
    var bucketManager = new qiniu.rs.BucketManager(mac, config);


    let setting = await this.ctx.model.Setting.findOne()
    //tools.DEBUG(setting)
    _marker = setting.clean_resource.marker
    // @param options 列举操作的可选参数
    //                prefix    列举的文件前缀
    //                marker    上一次列举返回的位置标记，作为本次列举的起点信息
    //                limit     每次返回的最大列举文件数量
    //                delimiter 指定目录分隔符
    var options = {
        prefix: prefix,
        limit: 1000, // max is 1000
        marker: _marker,
    };

    //bucketManager.listPrefix(this.config.qiniu.bucket, options, function(err, respBody, respInfo) {
    let res = await new Promise(function (resolve, reject) {
      bucketManager.listPrefix(_this.config.qiniu.bucket, options, function(err, respBody, respInfo) {
        if (err) {
          tools.DEBUG(err);
          throw err;
        }
        if (respInfo.statusCode == 200) {
          //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
          //指定options里面的marker为这个值
          /*var nextMarker = respBody.marker;
          var commonPrefixes = respBody.commonPrefixes;
          tools.DEBUG(nextMarker);
          tools.DEBUG(commonPrefixes);*/
          _marker = respBody.marker
          resolve(respBody)
        } else {
          //tools.DEBUG(respInfo.statusCode);
          //tools.DEBUG(respBody);
          reject(respBody);
        }
      })
    })
    //tools.DEBUG(res)
    let deleteOperations = []
    for (let i = 0; i < res.items.length; i++) {
      try {
          let article = await this.ctx.model.Article.findOne({ $or: [
            { 'content': { $regex: res.items[i].key, $options:'i' } },
            { 'cover': res.items[i].key }
          ]})
          /*let album = await this.ctx.model.Album.findOne({ $or: [
            { 'images': { $regex: res.items[i].key, $options:'i' } },
            { 'cover': res.items[i].key }
          ]})
          let timeline = await this.ctx.model.Timeline.findOne({ $or: [
            { 'points': { $regex: res.items[i].key, $options:'i' } },
            { 'cover': res.items[i].key }
          ]})
          let tip = await this.ctx.model.Tip.findOne({ $or: [
            { 'cover': res.items[i].key }
          ]})
          let user = await this.ctx.model.User.findOne({ $or: [
            { 'avatar': { $regex: res.items[i].key, $options:'i' } },
          ]})
          if(article || album || timeline || tip || user)*/
          if(article)
          {
            tools.DEBUG('exist ' + res.items[i].key)
            //tools.DEBUG(result)
          } else {
            tools.DEBUG('delete ' + res.items[i].key)
            deleteOperations.push(qiniu.rs.deleteOp(this.config.qiniu.bucket,res.items[i].key))
          }
        } catch(err) {
          tools.DEBUG(err.message)
          return
        }
    }
    //tools.DEBUG(deleteOperations)

    // delete 每个operations的数量不可以超过1000个，如果总数量超过1000，需要分批发送
    if (deleteOperations.length > 0) {
      bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {
        if (err) {
          tools.DEBUG(err);
        } else {
          // 200 is success, 298 is part success
          if (parseInt(respInfo.statusCode / 100) == 2) {
            respBody.forEach(function(item) {
              if (item.code == 200) {
                tools.DEBUG(item.code + "\tsuccess");
              } else {
                tools.DEBUG(item.code + "\t" + item.data.error);
              }
            });
          } else {
            tools.DEBUG(respInfo.deleteusCode);
            tools.DEBUG(respBody);
          }
        }
      });
    }
    await this.ctx.model.Setting.findByIdAndUpdate(setting._id, {'clean_resource':{'marker': _marker}})
    this.ctx.body = { options: deleteOperations, _marker: _marker }
  }
}
module.exports = ThirdService;
