// app/service/user.js
const Service = require('egg').Service;
const tools = require('../extend/tools')
const _ = require('lodash')
const querystring = require('querystring')
const axios = require('axios')
const util = require('util')

class TipService extends Service {
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
    const content = ctx.request.body.content
    const title = ctx.request.body.title
    let message
    if(!title) {
      message = '标题不能为空.'
    } else if(!content) {
      message = '内容不能为空.'
    }
    if(message) {
      ctx.status = 422
      ctx.body = {
        message: message
      }
      return
    }
    //将图片提取存入images,缩略图调用
    ctx.request.body.images = tools.extractImage(content)
    ctx.request.body["author_id"] = uid
    try {
      const article = await ctx.model.Article.create(ctx.request.body)
      ctx.status = 201
      ctx.body = {
        article_id: article._id
      }
      // 添加XunSearch索引
      let id = article._id
      const description = ctx.request.body.description
      var params = querystring.stringify({
        cmd: 'add',
        '_id': util.format('%s', id),
        'title': title,
        'content': content,
        'description': description
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
  
  async delete(uid, id) {
    let { ctx } = this
    const article = await ctx.model.Article.findOne({
      _id: id
    })
    if (!article) {
      ctx.status = 500
      ctx.body = {
        message: 'no article ' + id
      }
      return
    }
    if(article.author_id.toString() != uid) {
      ctx.status = 401
      ctx.body = {
        message: "您没有权限删除该文章"
      }
    } else {
      try {
        await ctx.model.Article.findByIdAndRemove(id)
        await ctx.model.Comment.remove({
          aid: id
        })
        ctx.status = 200
  
        // 删除XunSearch索引
        axios.delete(`${this.config.xunsearch.host}/${id}`)
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
      if(title && '' == title) {
        message = '标题不能为空.'
      } else if(content && '' == content) {
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

  async getRandomOne() {
    let { ctx } = this
    let size = 1
    try {
      let count = await ctx.model.Tip.countDocuments()
      let offset = GetRandomNum(0, count-1)
      let list = await ctx.model.Tip.find()
        .skip(offset)
        .limit(size)
      if (list.length > 0) {
        return list[0]
      } else {
        return {
          content: 'The thought of independence and freedom.', // 副标题
          cover: 'http://image.hicool.top/static/album/5ac0a4bac0979028323030f3/1503763878609383500.jpg', // 头图
        }
      }
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.body = {
        message: err.message
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
  
  async list() {
    let { ctx } = this
    //前台获取博客列表
    let page = (parseInt(ctx.query.page) > 0) ? parseInt(ctx.query.page) : 1
    let size = (parseInt(ctx.query.size) > 0) ? parseInt(ctx.query.size) : 10
    let offset = (page - 1) * size
    let sortName = String(ctx.query.sort_name) || 'publish_time'
    sortName = '-' + sortName
    let condition = {
    }
    try {
      const list = await ctx.model.Tip.find(condition)
        .skip(offset)
        .limit(size)
        .sort(sortName)
        .exec()
      const total = await ctx.model.Tip.countDocuments(condition)
      return {
        list: list,
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
  
}

function GetRandomNum(Min,Max)
{   
  var Range = Max - Min;   
  var Rand = Math.random();   
  return(Min + Math.round(Rand * Range));   
}

module.exports = TipService;
