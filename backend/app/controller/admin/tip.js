// app/controller/user.js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  cover: { type: 'string', required: false },
  content: { type: 'string', required: true },
};

class TipController extends Controller {
  // 增
  async create() {
    const ctx = this.ctx;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(createRule, ctx.request.body);
    await ctx.service.admin.tip.create();
  }
  
  // 删 删除博客(连同这篇文章的评论一起删除.)
  async destroy() {
    await this.ctx.service.admin.tip.delete(this.ctx.state.oauth.token.user.id, this.ctx.params.id)
  }
  
  // 改
  async update() {
    await this.ctx.service.article.update(this.ctx.state.oauth.token.user.id, this.ctx.params.id, this.ctx.request.body)
  }
  
  // 查
  async show() {
    let { ctx } = this
    ctx.body = await ctx.service.admin.tip.getRandomOne();
  }
  
  async list() {
    const list = await this.ctx.service.admin.tip.list()
    this.ctx.body = list;
  }
}
module.exports = TipController;
