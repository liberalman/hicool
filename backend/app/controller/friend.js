// app/controller/friend.js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  userId: { type: 'string', required: true },
};

class FriendController extends Controller {
  // 增
  async create() {
    const ctx = this.ctx;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(createRule, ctx.request.body);
    await ctx.service.friend.create(this.ctx.state.oauth.token.user.id); // ctx.request.body
  }
  
  // 删 删除博客(连同这篇文章的评论一起删除.)
  async destroy() {
    await this.ctx.service.friend.delete(this.ctx.state.oauth.token.user.id, this.ctx.params.id)
  }
  
  // 改
  async update() {
    await this.ctx.service.friend.update(this.ctx.state.oauth.token.user.id, this.ctx.params.id, this.ctx.request.body)
  }
  
  // 查
  async show() {
    const { ctx } = this;
    ctx.body = await ctx.service.friend.find(ctx.params.id);
  }
  
  
  async list() {
    await this.ctx.service.friend.list(this.ctx.state.oauth.token.user.id)
  }

}
module.exports = FriendController;
