// app/middleware/decrypt_body.js
const isJSON = require('koa-is-json');
const AES = require('../extend/aes');

module.exports = options => {
  return async function decryptBody(ctx, next) {
    await next();

    if (!ctx.body) return;

    /*if (ctx.body.content) {
      var key = 'YZh8yKD8Rv0CI1Dm'
      ctx.body.content = AES.decrypt(ctx.body.content, key)
    }*/
  };
};
