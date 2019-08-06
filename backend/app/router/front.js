'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const newsRouter = router.namespace('/api/v1/front');
  const jsonp = app.jsonp();

  // users
  newsRouter.get(`/users`, jsonp, controller.user.list);
  newsRouter.post(`/user`, jsonp, controller.user.create); // 注册
  newsRouter.post(`/user/login`, app.oAuth2Server.token(), 'user.token') // 登录，获取token
  newsRouter.get(`/user/logout`, app.oAuth2Server.token(), 'user.logout'); // 注销
  newsRouter.resources('user', `/user`, jsonp, controller.user);
  // 带上app.oAuth2Server.authenticate()表示该请求需要验证身份
  newsRouter.resources('me', `/me`, app.oAuth2Server.authenticate(), jsonp, controller.me);
  newsRouter.get(`/captcha`, 'user.captcha');
  
  // articles
  newsRouter.get(`/articles`, jsonp, controller.article.list);
  newsRouter.get(`/myarticles`, app.oAuth2Server.authenticate(), jsonp, controller.article.mylist);
  newsRouter.get(`/likes`, app.oAuth2Server.authenticate(), jsonp, controller.article.likes);
  newsRouter.get(`/article/:id`, jsonp, controller.article.show);
  newsRouter.post(`/article/:id/toggle_like`, app.oAuth2Server.authenticate(), jsonp, controller.article.toggleLike);
  newsRouter.resources('article', `/article`, app.oAuth2Server.authenticate(), jsonp, controller.article);
  
  // comment
  newsRouter.get(`/comment/:article_id/list`, jsonp, controller.comment.list);
  newsRouter.post(`/comment/:article_id`, app.oAuth2Server.authenticate(), jsonp, controller.comment.create);
  newsRouter.delete(`/comment/:comment_id`, app.oAuth2Server.authenticate(), jsonp, controller.comment.destroy);
  newsRouter.delete(`/comment/:comment_id/:reply_id`, app.oAuth2Server.authenticate(), jsonp, controller.comment.destroy_reply);
  newsRouter.post(`/comment/:comment_id/reply`, app.oAuth2Server.authenticate(), jsonp, controller.comment.reply);

  // tags
  newsRouter.get(`/tags`, jsonp, controller.tag.list);
  
  // albums
  newsRouter.get(`/albums`, jsonp, controller.album.list);
  newsRouter.get(`/album/:id`, jsonp, controller.album.show);
  newsRouter.resources('album', `/album`, app.oAuth2Server.authenticate(), jsonp, controller.album);
  
  // timelines
  newsRouter.get(`/timelines`, jsonp, controller.timeline.list);
  newsRouter.resources('timeline', `/timeline`, app.oAuth2Server.authenticate(), jsonp, controller.timeline);
  // point of timeline
  newsRouter.post(`/point`, app.oAuth2Server.authenticate(), jsonp, controller.timeline.createPoint);
  newsRouter.put(`/point/:timeline_id/:point_id`, app.oAuth2Server.authenticate(), jsonp, controller.timeline.updatePoint);
  newsRouter.delete(`/point/:timeline_id/:point_id`, app.oAuth2Server.authenticate(), jsonp, controller.timeline.destroyPoint);
  
  // third
  newsRouter.get(`/third/qiniu_token`, app.oAuth2Server.authenticate(), jsonp, controller.third.qiniuToken);
  newsRouter.post(`/third/qiniu_token`, app.oAuth2Server.authenticate(), jsonp, controller.third.qiniuRefreshToken);
};
