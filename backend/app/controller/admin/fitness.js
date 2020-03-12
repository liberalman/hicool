// app/controller/user.js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
  description: { type: 'string', required: false}
};

class FitnessController extends Controller {
  // 增
  async create() {
    const ctx = this.ctx;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(createRule, ctx.request.body);
    await ctx.service.admin.fitness.create(this.ctx.state.oauth.token.user.id); // ctx.request.body
  }
  
  // 删 删除博客(连同这篇文章的评论一起删除.)
  async destroy() {
    await this.ctx.service.admin.fitness.delete(this.ctx.state.oauth.token.user.id, this.ctx.params.id)
  }
  
  // 改
  async update() {
    await this.ctx.service.admin.fitness.update(this.ctx.state.oauth.token.user.id, this.ctx.params.id, this.ctx.request.body)
  }
  
  // 查
  async show() {
    const { ctx } = this;
    ctx.body = await ctx.service.admin.fitness.find(ctx.params.id);
  }
  
  async list() {
    const list = await this.ctx.service.admin.fitness.list()
    this.ctx.body = list;
  }
  
  async mylist() {
    await this.ctx.service.admin.fitness.mylist(this.ctx.state.oauth.token.user.id)
  }
}
module.exports = FitnessController;
