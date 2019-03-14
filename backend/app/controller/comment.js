// app/controller/user.js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  content: { type: 'string', required: true },
};

class CommentController extends Controller {
  // 增
  async create() {
    const ctx = this.ctx;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(createRule, ctx.request.body);
    await ctx.service.comment.create(this.ctx.state.oauth.token.user.id, ctx.params.article_id); // ctx.request.body
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
    await this.ctx.service.comment.delete(this.ctx.state.oauth.token.user.id, this.ctx.params.comment_id)
  }
  
  async destroy_reply() {
    await this.ctx.service.comment.delete_reply(this.ctx.state.oauth.token.user.id, this.ctx.params.comment_id, this.ctx.params.reply_id)
  }
  
  // 改
  async update() {
    await this.ctx.service.article.update(this.ctx.state.oauth.token.user.id, this.ctx.params.id, this.ctx.request.body)
  }
  
  // 查
  async show() {
    const { ctx } = this;
    ctx.body = await ctx.service.article.find(ctx.params.id);
  }
  
  async list() {
    await this.ctx.service.comment.list(this.ctx.params.article_id)
  }
  
  async likes() {
    const list = await this.ctx.service.article.likes(this.ctx.state.oauth.token.user.id)
    this.ctx.body = list;
  }
  
  async mylist() {
    await this.ctx.service.article.mylist(this.ctx.state.oauth.token.user.id)
  }
  
  async reply() {
    await this.ctx.service.comment.reply(this.ctx.state.oauth.token.user.id, this.ctx.params.comment_id)
  }
}
module.exports = CommentController;