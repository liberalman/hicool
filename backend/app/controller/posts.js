// app/controller/posts.js
exports.index = async ctx => {
  ctx.body = 'OK';
};

exports.new = async () => {};

exports.create = async ctx => {
  let count = ctx.cookies.get('count');
  count = count ? Number(count) : 0;
  ctx.cookies.set('count', ++count);
  ctx.body = {
    username: ctx.request.body.username,
    count: count
  };
};

exports.show = async ctx => {
  const start = Date.now();
  //ctx.body = await ctx.service.post.get();
  const used = Date.now() - start;
  // 设置一个响应头
  ctx.set('show-response-time', used.toString());
  ctx.body = ''
};

exports.edit = async () => {};

exports.update = async () => {};

exports.destroy = async () => {};