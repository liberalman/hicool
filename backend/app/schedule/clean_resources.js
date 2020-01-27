module.exports = {
  schedule: {
    type: 'worker',
    //cron: '0 0 0 */1 * *',
    cron: '0 0 */1 * * *',
  },
  async task(ctx) {
    //ctx.service.third.deleteImage(1)
    /*const res = await ctx.curl('https://www.hicool.top', {
      dataType: 'json',
    });
    console.log('aa');*/
  },
};
