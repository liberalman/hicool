// app/controller/user.js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  username: { type: 'string', required: false },
  password: 'string',
  tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
  email: 'string',
};

class AlbumController extends Controller {
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
    ctx.body = await ctx.service.album.find(ctx.params.id);
  }
  
  async list() {
    const list = await this.ctx.service.album.list()
    this.ctx.body = list;
  }
  
  async likes() {
    const list = await this.ctx.service.album.likes(this.ctx.state.oauth.token.user.id)
    this.ctx.body = list;
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

  async addPhoto() {
    const { ctx } = this;
    ctx.body = await ctx.service.album.addPhoto(ctx.state.oauth.token.user.id,
        ctx.params.id, ctx.request.body)
  }
}
module.exports = AlbumController;
