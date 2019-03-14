// app/controller/tag.js
const Controller = require('egg').Controller;

class ThirdController extends Controller {
  async qiniuToken() {
    let token = await this.ctx.service.third.qiniuToken();
    this.ctx.body = {
      uptoken: token
    }
  }
  async qiniuRefreshToken() {
    let token = await this.ctx.service.third.qiniuRefreshToken();
    this.ctx.body = {
      uptoken: token
    }
  }
}
module.exports = ThirdController;