'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  /*async index() {
    const { ctx } = this;
    ctx.body = 'Hello, wellcom to hicool! This is a IT\'s blog.';
  }*/
  async index() {
    const { ctx } = this;
    ctx.body = 'Hello, wellcom to hicool! This is a IT\'s blog.';
    /*// 发送/token
    const result = await this.ctx.curl('http://localhost:7001/api/v1/front/user/login', {
      dataType: 'json',
      // contentType: 'application/x-www-form-urlencoded', // 默认格式
      method: 'POST',
      timeout: 3000,
      data: {
        grant_type: 'password', // authorization_code
        username: 'zscchina1@163.com',
        password: '123456',
        client_id: 'web',
        client_secret: 'fskefgtarwdbawydrawpdpaiuiawdtg',
      }
    });
    this.ctx.body = result.data*/
  }
}

module.exports = HomeController;