// app/service/timeline.js
const Service = require('egg').Service;
class TimelineService extends Service {
  // 默认不需要提供构造函数。
  // constructor(ctx) {
  //   super(ctx); 如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
  //   // 就可以直接通过 this.ctx 获取 ctx 了
  //   // 还可以直接通过 this.app 获取 app 了
  // }
  constructor(ctx) {
    super(ctx);
  }

  async create(uid) {
    let { ctx } = this
    const title = ctx.request.body.title
    let message
    if(!title) {
      message = '标题不能为空.'
    } 
    if(message) {
      ctx.status = 422
      ctx.body = {
        message: message
      }
      return
    }
    //将图片提取存入images,缩略图调用
    ctx.request.body["author_id"] = uid
    try {
      const timeline = await ctx.model.Timeline.create(ctx.request.body)
      ctx.status = 201
      ctx.body = {
        timeline_id: timeline._id
      }
    } catch(err) {
      ctx.status = 500
      ctx.body = {
        message: err.message
      }
    }
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
    const timeline = await this.ctx.model.Timeline.findOne({_id: id})
      .select('title cover points description publish_time updated')
      .populate({
        path: 'author_id',
        select: '-_id nickname avatar'
      })
    return timeline
  }

  async delete(uid, id) {
    let { ctx } = this
    const timeline = await ctx.model.Timeline.findOne({
      _id: id
    })
    if (!timeline) {
      ctx.status = 500
      ctx.body = {
        message: 'no timeline ' + id
      }
      return
    }
    if(timeline.author_id.toString() != uid) {
      ctx.status = 401
      ctx.body = {
        message: "您没有删删权限"
      }
    } else {
      try {
        await ctx.model.Timeline.findByIdAndRemove(id)
        await ctx.model.Comment.remove({
          aid: id
        })
        ctx.status = 200
      } catch(err) {
        ctx.status = 500
        ctx.body = {
          message: err.message
        }
      }
    }
  }
  
  async update(id, params) {
    const title = params.nickname ? params.nickname.replace(/(^\s+)|(\s+$)/g, '') : ''
    const NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/
    //var EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    //检测一下
    let message
    if(title === '') {
      message = '名称不能为空'
    } else if(title.length <= 2 || title.length > 30 || !NICKNAME_REGEXP.test(title)) {
      //不符合呢称规定.
      message = '名称不合法'
    }
    if(message) {
      this.ctx.status = 422
      return {
        message: message
      }
    }
    const timeline = await this.ctx.model.Timeline.findByIdAndUpdate(id, params, {
      new: true,
      select: 'title description cover'
    })
    return timeline
  }
  async update(uid, id, data) {
    let { ctx } = this
    const timeline = await ctx.model.Timeline.findOne({
      _id: id
    })
    if(!timeline || timeline.author_id.toString() != uid) {
      ctx.status = 401
      ctx.body = {
        message: "您没有权限修改"
      }
    } else {
      if(data._id) {
        delete data._id
      }
      const title = data.title ? data.title.replace(/(^\s+)|(\s+$)/g, '') : ''
      const NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/
      let message
      if(title && '' == title) {
        message = '标题不能为空.'
      } else if (title.length <= 2 || title.length > 30 || !NICKNAME_REGEXP.test(title)) {
        //不符合呢称规定.
        message = '标题不合法'
      }
      if(message) {
        ctx.status = 422 // 422 Unprocessable Entity 请求格式正确，但是由于含有语义错误，无法响应。（RFC 4918 WebDAV）
        return ctx.body = {
          message: message
        }
      }
      try {
        const timeline = await ctx.model.Timeline.findByIdAndUpdate(id, data, {
          new: true
        })
        ctx.status = 200
      } catch(err) {
        ctx.status = 500
        ctx.body = {
          message: err.message
        }
      }
    }
  }
  
  async list() {
    let { ctx } = this
    let page = (parseInt(ctx.query.page) > 0) ? parseInt(ctx.query.page) : 1
    let size = (parseInt(ctx.query.size) > 0) ? parseInt(ctx.query.size) : 10
    let startRow = (page - 1) * size
    let sortName = String(ctx.query.sort_name) || 'publish_time'
    sortName = '-' + sortName
    let condition = {
      /*hide: {
        $eq: 0
      }*/
    }
    try {
      const list = await ctx.model.Timeline.find(condition)
        .select('title description cover')
        .populate({
          path: 'author_id',
          select: '-_id nickname avatar'
        })
        .skip(startRow)
        .limit(size)
        .sort(sortName)
        .exec()
      const total = await ctx.model.Timeline.countDocuments(condition)
      ctx.status = 200
      ctx.body = {
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
}
module.exports = TimelineService;
