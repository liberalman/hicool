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
}
module.exports = TagService;