// app/service/user.js
const Service = require('egg').Service;
const tools = require('../extend/tools')
const _ = require('lodash')
const querystring = require('querystring')
const axios = require('axios')
const util = require('util')

class FitnessService extends Service {
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
      const fitness = await ctx.model.Fitness.create(ctx.request.body)
      ctx.status = 201
      ctx.body = {
        fitness_id: fitness._id
      }
      // 添加XunSearch索引
      let id = fitness._id
      const description = ctx.request.body.description
      var params = querystring.stringify({
        cmd: 'add',
        '_id': util.format('%s', id),
        'title': title,
        'content': content,
        'description': description
      })
      axios.post(this.config.xunsearch.host, params)
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
    const fitness = await ctx.model.Fitness.findOne({
      _id: id
    })
    if (!fitness) {
      ctx.status = 500
      ctx.body = {
        message: 'no fitness ' + id
      }
      return
    }
    if(fitness.author_id.toString() != uid) {
      ctx.status = 401
      ctx.body = {
        message: "您没有权限删除该文章"
      }
    } else {
      try {
        await ctx.model.Fitness.findByIdAndRemove(id)
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
    const fitness = await ctx.model.Fitness.findOne({
      _id: id
    })
    if(!fitness || fitness.author_id.toString() != uid) {
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
        const fitness = await ctx.model.Fitness.findByIdAndUpdate(id, data, {
          new: true
        })
        ctx.status = 200
        ctx.body = {
          fitness_id: fitness._id
        }
        
        // 更新XunSearch索引
        var params = querystring.stringify({
          cmd: 'update',
          '_id': id,
          'title': fitness.title,
          'content': fitness.content,
          'description': fitness.description
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
    try {
      let result = await ctx.model.Fitness.findOne({_id: id})
        .populate({
          path: 'author_id',
          select: 'nickname avatar -_id'
        })
      ctx.status = 200
      return result
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
    let page = (parseInt(ctx.query.page) > 0) ? parseInt(ctx.query.page) : 1
    let size = (parseInt(ctx.query.size) > 0) ? parseInt(ctx.query.size) : 10
    let offset = (page - 1) * size
    let sortName = String(ctx.query.sort_name) || 'examination_time'
    let condition = {
    }
    try {
      const list = await ctx.model.Fitness.find(condition)
        .populate({
          path: 'author_id',
          select: ['nickname', 'avatar']
        })
        .skip(offset)
        .limit(size)
        .sort(sortName)
        .exec()
      const total = await ctx.model.Fitness.countDocuments(condition)
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
      const fitnessIds = await ctx.model.User.findOne({
          "_id": uid
        }, {
          "likeList": {
            "$slice": [offset, size]
          }
        })
        .select('-_id -avatar -nickname -images -email -hashedPassword -salt -defaultEditor -updated -created -status -role -provider -__v')
      const list = await ctx.model.Fitness.find({
          _id: {
            $in: fitnessIds.likeList
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
      const list = await ctx.model.Fitness.find(condition)
        .select('title images visit_count comment_count like_count publish_time author_id description tags reprint_url')
        .populate({
          path: 'author_id',
          select: 'nickname avatar -_id'
        })
        .skip(offset)
        .limit(size)
        .sort(sortName)
        .exec()
      const total = await ctx.model.Fitness.count(condition)
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
  
  async toggleLike(uid) {
    let { ctx } = this
    const fitnessId = ctx.params.id
    //如果已经喜欢过了,则从喜欢列表里,去掉文章ID,并减少文章喜欢数.否则添加到喜欢列表,并增加文章喜欢数.    
    //var isLink = _.indexOf(req.user.likeList.toString(), req.params.id)
    const user = await this.ctx.model.User.findOne({_id: uid})
    const isLike = _.findIndex(user.likeList, function(item) {
      return item.toString() == fitnessId
    })
    console.log(isLike, uid, fitnessId)
    let conditionOne, conditionTwo, liked
    if(isLike !== -1) {
      conditionOne = {
        '$pull': {
          'likeList': fitnessId
        }
      }
      conditionTwo = {
        '$inc': {
          'like_count': -1
        }
      }
      liked = false
    } else {
      conditionOne = {
        '$addToSet': {
          'likeList': fitnessId
        }
      }
      conditionTwo = {
        '$inc': {
          'like_count': 1
        }
      }
      liked = true
    }
  
    try {
      await ctx.model.User.findByIdAndUpdate(uid, conditionOne)
      const fitness = await ctx.model.Fitness.findByIdAndUpdate(fitnessId, conditionTwo, {
        new: true
      })
      ctx.status = 200
      ctx.body = {
        'count': fitness.like_count,
        'isLike': liked
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
module.exports = FitnessService;