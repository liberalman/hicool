// app/controller/user.js
exports.index = async ctx => {
  const userInfo = await ctx.service.user.me(ctx.state.oauth.token.user.id);
  if (userInfo) {
    ctx.body = userInfo;
  } else {
    ctx.status = 500
    ctx.body = {
      message: 'no data'
    };
  }
};

exports.update = async ctx => {
  // console.log(ctx.request.body)
  const userInfo = await ctx.service.user.update(ctx.state.oauth.token.user.id, ctx.request.body);
  if (userInfo) {
    ctx.body = userInfo;
  } else {
    ctx.status = 500
    ctx.body = {
      message: 'no update'
    };
  }
}

exports.token = async ctx => {
  /**
     * token值示例
     * {
     *      "accessToken": "3b52fd02f9820c590f15e2d36159952aa94dece7",
     *      "accessTokenExpiresAt": "2019-02-18T11:33:11.377Z",
     *      "refreshToken": "ced555f8e46bdd2c4ddc2635a73d9937126af2b1",
     *      "refreshTokenExpiresAt": "2019-03-04T10:33:11.377Z",
     *      "client": {
     *          "id": "web"
     *      },
     *      "user": {
     *          "userId": "5c566802128c810b3772f9e5",
     *          "email": "zscchina1@163.com",
     *          "avatar": "https://1.gravatar.com/avatar/a3e54af3cb6e157e496ae430aed4f4a3?s=96&d=mm"
     *      }
     *  }
     */
  ctx.body = ctx.state.oauth.token
};

exports.changePassword = async ctx => {
  ctx.body = await ctx.service.user.changePassword(ctx.state.oauth.token.user.id)
}

