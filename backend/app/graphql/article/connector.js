'use strict';

const DataLoader = require('dataloader');
const tools = require('../../../extend/tools');

const mapDataToHash = data => (
  data.reduce((acc, item) => {
    acc[item._id.toString()] = item; // eslint-disable-line no-underscore-dangle
    return acc;
  }, {})
);

class ArticleConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  async fetch(ids) {
    let page = (parseInt(this.ctx.query.page) > 0) ? parseInt(this.ctx.query.page) : 1
    let size = (parseInt(this.ctx.query.size) > 0) ? parseInt(this.ctx.query.size) : 10
    let offset = (page - 1) * size
    let sortName = String(this.ctx.query.sort_name) || 'updated'
    sortName = '-' + sortName
    let condition = {
      status: {
        $eq: 1
      }
    }
    try {
      const list = await this.ctx.model.Article.find({_id: { $in: ids } })
        .skip(offset)
        .limit(size)
        .sort(sortName)
        .exec()
      
      const hash = mapDataToHash(list)
      return ids.map((id) => {
        if (hash[id.toString()]) {
          return hash[id.toString()];
        }
        return null;
      });
    } catch(err) {
      // ctx.throw(err)
      tools.DEBUG(err)
      let arr = new Array()
      let obj = { message: err.message }
      arr.push(obj)
      return new Promise(reject => reject(arr))
    }
  }

  fetchByIds(ids) {
    return this.loader.loadMany(ids);
  }

  fetchById(id) {
    return this.loader.load(id);
  }
}

module.exports = ArticleConnector;
