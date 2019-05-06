// app/controller/user.js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  cover: { type: 'string', required: false },
  title: 'string',
  description: { type: 'string', required: false }
};

class TimelineController extends Controller {
  // 增
  async create() {
    const ctx = this.ctx;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(createRule, ctx.request.body);                                                                       
    await ctx.service.timeline.create(this.ctx.state.oauth.token.user.id);
  }

  // 删 删除博客(连同这篇文章的评论一起删除.)
  async destroy() {
    await this.ctx.service.timeline.delete(this.ctx.state.oauth.token.user.id, this.ctx.params.id)                   
  }
  
  async show() {
    const { ctx } = this;
    const timelineId = ctx.params.id;
    const timeline = await ctx.service.timeline.find(timelineId);
    ctx.body = timeline;
  }
  
  async list() {
    await this.ctx.service.timeline.list()
  }
}
module.exports = TimelineController;
