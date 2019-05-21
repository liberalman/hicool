module.exports = {
  schedule: {
    type: 'worker',
    cron: '0 0 0 */1 * *',
  },
  async task(ctx) {
    const res = await ctx.curl('http://www.hicool.top', {
      dataType: 'json',
    });
    console.log('aa');
  },
};
