'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  //const jsonp = app.jsonp();
  //const prefix = '/api/v1/front'
  
  router.get('/', controller.home.index);
  router.get('/news', controller.news.list);
  router.get('health', `/status`, controller.home.index);
  // OAuth controller 可以调出登录页面的示例
  app.get('/authorize', controller.user.authorize);
  // router.all('/graphql', app.oAuth2Server.authenticate())

  require('./router/front')(app);
  require('./router/admin')(app);
};
