// app/controller/tag.js
const Controller = require('egg').Controller;

class TagController extends Controller {
  async list() {
    await this.ctx.service.tag.list()
  }
}
module.exports = TagController;