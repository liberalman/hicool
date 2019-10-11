// app/service/user.js
const Service = require('egg').Service;
const tools = require('../extend/tools')
const _ = require('lodash')
const xss = require('xss')

class CommentService extends Service {
  // 默认不需要提供构造函数。
  // constructor(ctx) {
  //   super(ctx); 如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
  //   // 就可以直接通过 this.ctx 获取 ctx 了
  //   // 还可以直接通过 this.app 获取 app 了
  // }
  constructor(ctx) {
    super(ctx);
  }

  async create(uid, articleId) {
    let { ctx } = this
    let content = ctx.request.body.content
    const userId = uid
    let message
    if(!articleId) {
      message = '缺少必须参数'
    } else if(!content || content == '') {
      message = '评论内容不能为空'
    }
    if(message) {
      ctx.status = 422
      return ctx.body = {
        message: message
      }
    }
    content = xss(content)
  
    try {
      let result = await ctx.model.Comment.create({
        articleId: articleId,
        content: content,
        userId: userId,
        likeNum: 0,
      })
      let comment = result.toObject()
      let user = await ctx.model.User.findOne({ _id: uid})
      comment.userId = {
        _id: uid,
        nickname: user.nickname,
        avatar: user.avatar
      }
      await ctx.model.Article.findByIdAndUpdate(articleId, {
        $inc: {
          comment_count: 1
        }
      }).exec()
      ctx.status = 200
      ctx.body = comment
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.body = {
        message: err.message
      }
    }
  }
  
  async delete(uid, commentId) {
    let { ctx } = this
    try {
      // Comment.findByIdAndRemove(commentId)
      const result = await ctx.model.Comment.remove({_id:commentId, userId: uid }) // 必须是自己回复的，才能删，不能删别人的。
      //评论数-1  
      ctx.model.Article.findByIdAndUpdate(result.articleId, {
        $inc: {
          comment_count: -1
        }
      }).exec()
      ctx.status = 200
      ctx.body = result
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.body = {
        message: err.message
      }
    }
  }
  
  async delete_reply(uid, commentId, replyId) {
    let { ctx } = this
    if(!replyId) {
      ctx.status = 422
      return ctx.body = {
        message: '缺少回复ID.'
      }
    }
    try {
      const result = await ctx.model.Comment.findByIdAndUpdate(commentId, {
        $pull: {
          replys: {
            _id: replyId,
            fromUserId: uid, // 必须是自己回复的，才能删，不能删别人的。
          }
        }
      }, {
        new: true
      })
      console.log(result)
      ctx.status = 200
      ctx.body = result
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.body = {
        message: err.message
      }
    }
  }
  
  async update(uid, id, data) {
    let { ctx } = this
    const article = await ctx.model.Article.findOne({
      _id: id
    })
    if(!article || article.author_id.toString() != uid) {
      ctx.status = 401
      ctx.body = {
        message: "您没有权限修改该文章"
      }
    } else {
      if(data._id) {
        delete data._id
      }
      const content = data.content
      const title = data.title
      let message
      if(!title) {
        message = '标题不能为空.'
      } else if(!content) {
        message = '内容不能为空.'
      }
      if(message) {
        ctx.status = 422 // 422 Unprocessable Entity 请求格式正确，但是由于含有语义错误，无法响应。（RFC 4918 WebDAV）
        return ctx.body = {
          message: message
        }
      }
      //将图片提取存入images,缩略图调用
      data.images = tools.extractImage(content)
      data.updated = new Date()
      if(data.isRePub) {
        data.publish_time = new Date()
      }
      try {
        const article = await ctx.model.Article.findByIdAndUpdate(id, data, {
          new: true
        })
        ctx.status = 200
        ctx.body = {
          article_id: article._id
        }
        
        // 更新XunSearch索引
        var params = querystring.stringify({
          cmd: 'update',
          '_id': id,
          'title': article.title,
          'content': article.content,
          'description': article.description
        })
        axios.post(this.config.xunsearch.host, params)
        /*.then(function (response) {
          console.log(response)
        })*/
      } catch(err) {
        // ctx.throw(err)
        ctx.status = 500
        ctx.body = {
          message: err.message
        }
      }
    }
  }

  async find(id) {
    let { ctx } = this
    const isRender = ctx.params.isRender
    //每次获取之后,将阅读数加1
    try {
      let result = await ctx.model.Article.findById(id, '-images').populate({
        path: 'author_id',
        select: 'nickname avatar -_id'
      })
      .populate({
        path: 'tags',
        select: '_id name'
      })
      if(1 == isRender) {
        const md = new MarkdownIt({
          html: true //启用html标记转换
        })
        result.content = md.render(result.content)
      }
      if(!result)
      {
        ctx.status = 500
        ctx.body = {
          message: 'not found article id:' + id
        }
        return
      }
      result.visit_count++
      await ctx.model.Article.findByIdAndUpdate(id, {
        $inc: {
          visit_count: 1
        }
      })
      
      ctx.status = 200
      ctx.body = result.info
  
      let isLike = false
      if(ctx.req.user){
        let findLike = _.findIndex(ctx.req.user.likeList, function(item) {
          return item.toString() == id
        })
        if(-1 != findLike){
          isLike = true
        }
      }
      ctx.body['isLike'] = isLike
      return ctx.body
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.body = {
        message: err.message
      }
    }
  }
  
  async list(articleId) {
    let { ctx } = this
    const condition = {
      articleId: articleId,
      status: {
        $eq: 1
      }
    }
    try {
      const list = await ctx.model.Comment.find(condition)
        .sort('created')
        .populate({
          path: 'userId',
          select: 'nickname avatar _id',
          match: {
            nickname: {
              $exists: true
            }
          },
        })
        .populate({
          path: 'replys.fromUserId',
          select: 'nickname avatar _id',
          match: {
            nickname: {
              $exists: true
            }
          },
        })
        .populate({
          path: 'replys.toUserId',
          select: 'nickname avatar _id',
          match: {
            nickname: {
              $exists: true
            }
          },
        })
        .exec()
      const total = await ctx.model.Comment.count(condition)
      ctx.status = 200
      ctx.body = {
        list: list,
        total: total
      }
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.body = {
        message: err.message
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
      // ctx.throw(err)
      ctx.status = 500
      ctx.body = {
        message: err.message
      }
    }
  }
  
  async mylist(uid) {
    let { ctx } = this
    let page = (parseInt(ctx.query.page) > 0) ? parseInt(ctx.query.page) : 1
    let size = (parseInt(ctx.query.size) > 0) ? parseInt(ctx.query.size) : 10
    let offset = (page - 1) * size
    let sortName = String(ctx.query.sort_name) || 'publish_time'
    let type = ctx.query.type ? parseInt(ctx.query.type) : 0
    sortName = '-' + sortName
    let condition = {
      status: {
        $eq: 1
      },
      author_id: {
        $eq: uid
      }
    }
    if(type > 0) {
      condition.type = {
        $eq: type
      }
    }
    if(ctx.query.tag_id) {
      //tagId = new mongoose.Types.ObjectId(tagId)
      const tagId = String(ctx.query.tag_id)
      condition = _.defaults(condition, {
        tags: {
          $elemMatch: {
            $eq: tagId
          }
        }
      })
    }
    try {
      const list = await ctx.model.Article.find(condition)
        .select('title images visit_count comment_count like_count publish_time author_id description tags reprint_url')
        .populate({
          path: 'author_id',
          select: 'nickname avatar -_id'
        })
        .skip(offset)
        .limit(size)
        .sort(sortName)
        .exec()
      const total = await ctx.model.Article.count(condition)
      ctx.status = 200
      ctx.body = {
        'list': list,
        'total': total,
        'page': page,
        'size': size
      }
    } catch(err) {
      // ctx.throw(err)
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
  
  async reply(uid, commentId) {
    let { ctx } = this
    if(!ctx.request.body.content || ctx.request.body.content == '') {
      ctx.status = 422
      return ctx.body = {
        message: '回复内容不能为空'
      }
    }
    ctx.request.body.content = xss(ctx.request.body.content)
    let reply = ctx.request.body
    /*reply.user_info = {
      id: ctx.req.user._id,
      nickname: ctx.req.user.nickname
    }*/
    reply.fromUserId = uid
    reply.created = new Date()
    try {
      const result = await ctx.model.Comment.findByIdAndUpdate(commentId, {
        '$push': {
          'replys': reply
        }
      }, {
        new: true
      })
      ctx.status = 200
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.body = {
        message: err.message
      }
    }
  }
}
module.exports = CommentService;
