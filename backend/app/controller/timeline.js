// app/controller/user.js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  username: { type: 'string', required: false },
  password: 'string',
  tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
  email: 'string',
};

class TimelineController extends Controller {
  async create() {
    const ctx = this.ctx;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(createRule, ctx.request.body);
    // 调用 service 创建一个 topic
    const id = await ctx.service.user.create(ctx.request.body);
    // 设置响应体和状态码
    ctx.body = {
      id: id,
    };
    ctx.status = 201;
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

  async add() {
    const user = await this.ctx.model.User.create({
      name: 'test',
      password: '123456',
      description: 'zhou',
    });
    const client = await this.ctx.model.Client.create({
      clientId: 'hyewfbgawd',
      clientSecret: 'fskefgtarwdbawydrawpdpaiuiawdtg',
      redirectUri: 'http://127.0.0.1:7002/auth/redirect',
      grants: 'password,authorization_code,refresh_token'
    });
    this.ctx.body = {user, client};
  }
}
module.exports = TimelineController;
