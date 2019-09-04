// app/service/user.js
const mongoose = require('mongoose')
const Service = require('egg').Service;
class AlbumService extends Service {
  // 默认不需要提供构造函数。
  // constructor(ctx) {
  //   super(ctx); 如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
  //   // 就可以直接通过 this.ctx 获取 ctx 了
  //   // 还可以直接通过 this.app 获取 app 了
  // }
  constructor(ctx) {
    super(ctx);
    this.root = 'https://cnodejs.org/api/v1';
  }

  async create(params) {
    // 调用 CNode V1 版本 API
    const result = await this.ctx.curl(`${this.root}/topics`, {
      method: 'post',
      data: params,
      dataType: 'json',
      contentType: 'json',
    });
    // 检查调用是否成功，如果调用失败会抛出异常
    this.checkSuccess(result);
    // 返回创建的 topic 的 id
    return result.data.topic_id;
  }

  // 封装统一的调用检查函数，可以在查询、创建和更新等 Service 中复用
  checkSuccess(result) {
    if (result.status !== 200) {
      const errorMsg = result.data && result.data.error_msg ? result.data.error_msg : 'unknown error';
      this.ctx.throw(result.status, errorMsg);
    }
    if (!result.data.success) {
      // 远程调用返回格式错误
      this.ctx.throw(500, 'remote response error', { data: result.data });
    }
  }
  
  async find(id) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    let result = await this.ctx.model.Album.findById(id).populate({
      path: 'author_id',
      select: '-_id nickname avatar'
    })
    return result.info
  }
  
  async me(uid) {
    const user = await this.ctx.model.User.findOne({_id: uid})
      .select('nickname avatar email description status')
    return user
  }
  
  async update(uid, params) {
    const nickname = params.nickname ? params.nickname.replace(/(^\s+)|(\s+$)/g, '') : ''
    const NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/
    //var EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    //检测一下
    let message
    if(nickname === '') {
      message = '呢称不能为空'
    } else if(nickname.length <= 2 || nickname.length > 15 || !NICKNAME_REGEXP.test(nickname)) {
      //不符合呢称规定.
      message = '呢称不合法'
    }
    if(message) {
      this.ctx.status = 422
      return {
        message: message
      }
    }
    const user = await this.ctx.model.User.findByIdAndUpdate(uid, params, {
      new: true,
      select: 'nickname avatar email description status'
    })
    return user
  }

  async getPicture(uid) {
    const result = await this.ctx.curl(`http://photoserver/uid=${uid}`, { dataType: 'json' });
    return result.data;
  }
  
  async list() {
    let { ctx } = this
    let page = (parseInt(ctx.query.page) > 0) ? parseInt(ctx.query.page) : 1
    let size = (parseInt(ctx.query.size) > 0) ? parseInt(ctx.query.size) : 10
    let offset = (page - 1) * size
    let sortName = String(ctx.query.sort_name) || 'publish_time'
    sortName = '-' + sortName
    let condition = {
      hide: {
        $eq: 0
      }
    }
    try {
      const list = await ctx.model.Album.find(condition)
        .select('title cover publish_time author_id content w1')
        .populate({
          path: 'author_id',
          select: '-_id nickname avatar'
        })
        .skip(offset)
        .limit(size)
        .sort(sortName)
        .exec()
      const total = await ctx.model.Album.count(condition)
      ctx.status = 200
      return {
        'list': list,
        'total': total,
        'page': page,
        'size': size
      }
    } catch(err) {
      //ctx.throw(err)
      ctx.status = 500
      return {
        message: err
      }
    }
  }
  
  async likes(uid) {
    //获取like博客列表
    let { ctx } = this
    let page = (parseInt(ctx.query.page) > 0) ? parseInt(ctx.query.page) : 1
    let size = (parseInt(ctx.query.size) > 0) ? parseInt(ctx.query.size) : 10
    let offset = (page - 1) * size
    try {
      const queryTotal = await ctx.model.User.aggregate([{
        "$match": {
          "_id": uid,
          "likeList": {
            $exists: true
          }
        }
      }, {
        "$project": {
          "_id": 0,
          "total": {
            "$size": "$likeList"
          }
        }
      }])
      const articleIds = await ctx.model.User.findOne({
          "_id": uid
        }, {
          "likeList": {
            "$slice": [offset, size]
          }
        })
        .select('-_id -avatar -nickname -images -email -hashedPassword -salt -defaultEditor -updated -created -status -role -provider -__v')
      const list = await ctx.model.Article.find({
          _id: {
            $in: articleIds.likeList
          }
        })
        .select('title images visit_count comment_count like_count publish_time author_id description tags')
        .populate({
          path: 'author_id',
          select: 'nickname avatar -_id'
        })
      return {
        'list': list,
        'total': queryTotal.length > 0 ? queryTotal[0].total : 0,
        'page': page,
        'size': size,
      }
    } catch(err) {
      ctx.throw(err)
    }
  }

  async addPhoto(uid, albumId, params) {
    params._id = new mongoose.Types.ObjectId()
    const res = await this.ctx.model.Album
      .update(
        { _id: albumId },
        { $push: { images: params } }
      )
    return res
  }
}
module.exports = AlbumService;
