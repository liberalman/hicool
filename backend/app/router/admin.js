'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const newsRouter = router.namespace('/api/v1/admin');
  const jsonp = app.jsonp();

  // users
  newsRouter.get(`/users`, jsonp, app.oAuth2Server.authenticate(), controller.admin.user.list);
  newsRouter.post(`/user`, jsonp, app.oAuth2Server.authenticate(), controller.user.create); // 添加用户
  newsRouter.post(`/user/login`, app.oAuth2Server.token(), 'user.token') // 登录，获取token
  newsRouter.get(`/user/logout`, app.oAuth2Server.token(), 'user.logout'); // 注销
  newsRouter.resources('user', `/user`, app.oAuth2Server.authenticate(), jsonp, controller.admin.user);
  // 带上app.oAuth2Server.authenticate()表示该请求需要验证身份
  newsRouter.resources('me', `/me`, app.oAuth2Server.authenticate(), jsonp, controller.me);
  
  // articles
  newsRouter.get(`/articles`, jsonp, controller.admin.article.list);
  newsRouter.get(`/myarticles`, app.oAuth2Server.authenticate(), jsonp, controller.article.mylist);
  newsRouter.get(`/likes`, app.oAuth2Server.authenticate(), jsonp, controller.article.likes);
  newsRouter.get(`/article/:id`, jsonp, controller.article.show);
  newsRouter.post(`/article/:id/toggle_like`, app.oAuth2Server.authenticate(), jsonp, controller.article.toggleLike);
  newsRouter.resources('article', `/article`, app.oAuth2Server.authenticate(), jsonp, controller.article);
  newsRouter.delete('/image/:id', app.oAuth2Server.authenticate(), jsonp, controller.admin.article.cleanImage);
  
  // comment
  newsRouter.get(`/comment/:article_id/list`, jsonp, controller.comment.list);
  newsRouter.post(`/comment/:article_id`, app.oAuth2Server.authenticate(), jsonp, controller.comment.create);
  newsRouter.delete(`/comment/:comment_id`, app.oAuth2Server.authenticate(), jsonp, controller.comment.destroy);
  newsRouter.delete(`/comment/:comment_id/:reply_id`, app.oAuth2Server.authenticate(), jsonp, controller.comment.destroy_reply);
  newsRouter.post(`/comment/:comment_id/reply`, app.oAuth2Server.authenticate(), jsonp, controller.comment.reply);

  // tags
  newsRouter.get(`/categories`, jsonp, controller.admin.tag.categoryList);
  newsRouter.get(`/tags`, jsonp, controller.admin.tag.list);
  newsRouter.resources('tag', `/tag`, app.oAuth2Server.authenticate(), jsonp, controller.admin.tag);
  
  // albums
  newsRouter.get(`/albums`, jsonp, controller.album.list);
  newsRouter.get(`/album/:id`, jsonp, controller.album.show);
  newsRouter.resources('album', `/album`, app.oAuth2Server.authenticate(), jsonp, controller.album);
  
  // timelines
  newsRouter.get(`/timelines`, jsonp, controller.timeline.list);
  
  // third
  newsRouter.get(`/third/qiniu_token`, app.oAuth2Server.authenticate(), jsonp, controller.third.qiniuToken);
  newsRouter.post(`/third/qiniu_token`, app.oAuth2Server.authenticate(), jsonp, controller.third.qiniuRefreshToken);

  // tip
  newsRouter.get(`/tips`, app.oAuth2Server.authenticate(), jsonp, controller.tip.list);
  newsRouter.get(`/tip`, app.oAuth2Server.authenticate(), jsonp, controller.tip.show);
  newsRouter.post(`/tip`, app.oAuth2Server.authenticate(), jsonp, controller.admin.tip.create);
  newsRouter.delete('/tip/:id', app.oAuth2Server.authenticate(), jsonp, controller.admin.tip.destroy);

  // fitness
  newsRouter.get(`/fitnesses`, jsonp, controller.admin.fitness.list);
  newsRouter.get(`/fitness/:id`, jsonp, controller.admin.fitness.show);
  newsRouter.resources('fitness', `/fitness`, app.oAuth2Server.authenticate(), jsonp, controller.admin.fitness);
};
