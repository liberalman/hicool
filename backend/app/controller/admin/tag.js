// app/controller/tag.js
const Controller = require('egg').Controller;

const createRule = {
  name: { type: 'string', required: true },
  cid: { type: 'string', required: false },
  is_index: { type: 'boolean', values: false, required: false },
  is_show: { type: 'boolean', values: false, required: false },
  sort: { type: 'number', values: 1, required: false }
};

class TagController extends Controller {
  async list() {
    await this.ctx.service.admin.tag.list()
  }
  
  async categoryList() {
    await this.ctx.service.admin.tag.categoryList()
  }
  
  // 增
  async create() {
    const ctx = this.ctx;
    ctx.validate(createRule, ctx.request.body);
    await ctx.service.admin.tag.create();
  }
  
  // 删
  async destroy() {
    await this.ctx.service.admin.tag.delete(this.ctx.state.oauth.token.user.id, this.ctx.params.id)
  }
  
  // 改
  async update() {
    await this.ctx.service.admin.tag.update(this.ctx.state.oauth.token.user.id, this.ctx.params.id, this.ctx.request.body)
  }
}
module.exports = TagController;