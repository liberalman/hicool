// app/controller/user.js
const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const createRule = {
  nickname: { type: 'string', required: false },
  password: 'string',
  tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
  email: 'string',
};

class UserController extends Controller {
  async create() {
    const ctx = this.ctx;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(createRule, ctx.request.body);
    /*// 调用 service 创建一个 topic
    const id = await ctx.service.user.create(ctx.request.body);
    // 设置响应体和状态码
    ctx.body = {
      id: id,
    };
    ctx.status = 201;*/
    await ctx.service.admin.user.create(ctx.request.body);
  }

  // 删
  async destory() {
    await this.ctx.service.admin.user.delete(this.ctx.params.id)
  }
  
  // 改
  async update() {
    await this.ctx.service.admin.user.update(this.ctx.params.id)
  }
  
  // 查
  async show() {
    const { ctx } = this;
    const userId = ctx.params.id;
    const userInfo = await ctx.service.admin.user.find(userId);
    ctx.body = userInfo;
  }
  
  async list() {
    const list = await this.ctx.service.admin.user.list()
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

  // 登录页
  async authorize() {
    const query = this.ctx.querystring
    console.log('query: ', query)
    await this.ctx.render('oauth/login.html', {query: query})
  }

  async token(){
    /**
     * token值示例
     * {
     *      "accessToken": "3b52fd02f9820c590f15e2d36159952aa94dece7",
     *      "accessTokenExpiresAt": "2019-02-18T11:33:11.377Z",
     *      "refreshToken": "ced555f8e46bdd2c4ddc2635a73d9937126af2b1",
     *      "refreshTokenExpiresAt": "2019-03-04T10:33:11.377Z",
     *      "client": {
     *          "id": "web"
     *      },
     *      "user": {
     *          "userId": "5c566802128c810b3772f9e5",
     *          "email": "zscchina1@163.com",
     *          "avatar": "https://1.gravatar.com/avatar/a3e54af3cb6e157e496ae430aed4f4a3?s=96&d=mm"
     *      }
     *  }
     */
    this.ctx.body = this.ctx.state.oauth.token
  }
  
  async logout() {
    this.ctx.body = "ok"
  }
}
module.exports = UserController;
