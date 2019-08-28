// app/controller/user.js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
  description: { type: 'string', required: false}
};

class TipController extends Controller {
  // 增
  async create() {
    const ctx = this.ctx;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(createRule, ctx.request.body);
    await ctx.service.article.create(this.ctx.state.oauth.token.user.id); // ctx.request.body
    /*// 调用 service 创建一个 topic
    const id = await ctx.service.user.create(ctx.request.body);
    // 设置响应体和状态码
    ctx.body = {
      id: id,
    };
    ctx.status = 201; // 201 Created
    // 请求已经被实现，而且有一个新的资源已经依据请求的需要而建立，且其 URI 已经随Location 头信息返回。假如需要的资源无法及时建立的话，应当返回 '202 Accepted'。
    */
  }
  
  // 删 删除博客(连同这篇文章的评论一起删除.)
  async destroy() {
    await this.ctx.service.article.delete(this.ctx.state.oauth.token.user.id, this.ctx.params.id)
  }
  
  // 改
  async update() {
    await this.ctx.service.article.update(this.ctx.state.oauth.token.user.id, this.ctx.params.id, this.ctx.request.body)
  }
  
  // 查
  async show() {
    let { ctx } = this
    ctx.body = await ctx.service.tip.getRandomOne();
  }
  
  async list() {
    const list = await this.ctx.service.tip.list()
    this.ctx.body = list;
  }
}
module.exports = TipController;
