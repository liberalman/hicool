// app/service/user.js
const Service = require('egg').Service;

class TagService extends Service {
  
  async list() {
    let { ctx } = this
    try {
      const result = await ctx.model.Tag.find({
        is_show: true
      }, {
        is_show: 0,
        is_index: 0,
        __v: 0,
        sort: 0,
        cid: 0
      }, {
        sort: {
          'sort': -1
        }
      })
      ctx.status = 200
      ctx.body = { list: result }
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.baody = {
        message: err.message
      }
    }
  }
  
  async categoryList() {
    let { ctx } = this
    try {
      const result = await ctx.model.TagCategory.find({})
      ctx.status = 200
      ctx.body = { list: result }
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.baody = {
        message: err.message
      }
    }
  }
  
  async create() {
    let { ctx } = this
    const cid = ctx.request.body.cid
    const name = ctx.request.body.name
    let message
    if(!name) {
      message = '名称不能为空.'
    }
    if(message) {
      ctx.status = 422
      ctx.body = {
        message: message
      }
      return
    }
    try {
      const tag = await ctx.model.Tag.create(ctx.request.body)
      ctx.status = 201
      ctx.body = {
        _id: tag._id
      }
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
    const tag = await ctx.model.Tag.findOne({
      _id: id
    })
    if (!tag) {
      ctx.status = 500
      ctx.body = {
        message: 'no tag ' + id
      }
      return
    }
    /*if(uid != "5a4ca9c0623bf51b5e326f5f") {
      ctx.status = 401
      ctx.body = {
        message: "您没有权限删除该文章"
      }
    } else {*/
      try {
        await ctx.model.Tag.findByIdAndRemove(id)
        ctx.status = 200
      } catch(err) {
        // ctx.throw(err)
        ctx.status = 500
        ctx.body = {
          message: err.message
        }
      }
    //}
  }
  
  async update(uid, id, data) {
    let { ctx } = this
    const tag = await ctx.model.Tag.findOne({
      _id: id
    })
    /*if(!tag || uid != "5a4ca9c0623bf51b5e326f5f") {
      ctx.status = 401
      ctx.body = {
        message: "您没有权限修改该文章"
      }
    } else {*/
      if(data._id) {
        delete data._id
      }
      const content = data.content
      const name = data.name
      let message
      if(name && '' == name) {
        message = '名称不能为空.'
      }
      if(message) {
        ctx.status = 422 // 422 Unprocessable Entity 请求格式正确，但是由于含有语义错误，无法响应。（RFC 4918 WebDAV）
        return ctx.body = {
          message: message
        }
      }
      try {
        const tag = await ctx.model.Tag.findByIdAndUpdate(id, data, {
          new: true
        })
        ctx.status = 200
        ctx.body = {
          _id: tag._id
        }
      } catch(err) {
        // ctx.throw(err)
        ctx.status = 500
        ctx.body = {
          message: err.message
        }
      }
    //}
  }
}
module.exports = TagService;