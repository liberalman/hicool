// app/service/user.js
var mongoose = require('mongoose');
const Service = require('egg').Service;
class UserService extends Service {
  // 默认不需要提供构造函数。
  // constructor(ctx) {
  //   super(ctx); 如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
  //   // 就可以直接通过 this.ctx 获取 ctx 了
  //   // 还可以直接通过 this.app 获取 app 了
  // }
  constructor(ctx) {
    super(ctx);
    this.root = 'http://api.hicool.top/api/v1';
  }

  async create(params) {
    let { ctx } = this
    const nickname = ctx.request.body.nickname ? ctx.request.body.nickname.replace(/(^\s+)|(\s+$)/g, '') : ''
    const email = ctx.request.body.email ? ctx.request.body.email.replace(/(^\s+)|(\s+$)/g, '') : ''
    const NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/
    const EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    let message
    if(nickname === '') {
      message = '呢称不能为空'
    } else if(email === '') {
      message = '邮箱地址不能为空'
    } else if(nickname.length <= 2 || nickname.length > 15 || !NICKNAME_REGEXP.test(nickname)) {
      //不符合呢称规定.
      message = '呢称不合法'
    } else if(email.length <= 4 || email.length > 30 || !EMAIL_REGEXP.test(email)) {
      message = '邮箱地址不合法'
    }
    if(message) {
      ctx.status = 422
      return ctx.body = {
        message: message
      }
    }
    try {
      let newUser = new ctx.model.User(ctx.request.body)
      newUser.role = 'user'
      const user = await newUser.save()
      await ctx.model.Logs.create({
        uid: user._id,
        content: '创建新用户 ' + (user.email || user.nickname),
        type: 'user'
      })
      ctx.status = 201
      ctx.body = {
        _id: user._id
      }
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.body = {
        message: err.message
      }
    }
  }

  // 封装统一的调用检查函数，可以在查询、创建和更新等 Service 中复用
  checkSuccess(result) {
    if (result.status !== 200) {
      const errorMsg = result.data && result.data.error_msg ? result.data.error_msg : 'unknown error';
      this.ctx.throw(result.status, errorMsg);
    }
    if (!result.data.success) {
      // 远程调用返回格式错误
      this.ctx.throw(500, 'remote response error', { data: result.data });
    }
  }
  
  async find(uid) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const user = await this.ctx.model.User.findOne({_id: uid})
      .select('nickname avatar')
    return {
      _id: user._id,
      nickname: user.nickname,
      avatar: user.avatar
    }
  }
  
  async me(uid) {
    const user = await this.ctx.model.User.findOne({_id: uid})
      .select('nickname avatar email description status')
    return user
  }
  
  async update(uid, params) {
    const nickname = params.nickname ? params.nickname.replace(/(^\s+)|(\s+$)/g, '') : ''
    const NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/
    //var EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    //检测一下
    let message
    if(nickname === '') {
      message = '呢称不能为空'
    } else if(nickname.length <= 2 || nickname.length > 15 || !NICKNAME_REGEXP.test(nickname)) {
      //不符合呢称规定.
      message = '呢称不合法'
    }
    if(message) {
      this.ctx.status = 422
      return {
        message: message
      }
    }
    const user = await this.ctx.model.User.findByIdAndUpdate(uid, params, {
      new: true,
      select: 'nickname avatar email description status'
    })
    return user
  }

  async getPicture(uid) {
    const result = await this.ctx.curl(`http://photoserver/uid=${uid}`, { dataType: 'json' });
    return result.data;
  }
  
  async list() {
    let { ctx } = this
    let page = (parseInt(ctx.query.page) > 0) ? parseInt(ctx.query.page) : 1
    let size = (parseInt(ctx.query.size) > 0) ? parseInt(ctx.query.size) : 10
    let offset = (page - 1) * size
    let sortName = String(ctx.query.sort_name) || 'updated'
    sortName = '-' + sortName
    let condition = {
      status: {
        $eq: 1
      }
    }
    try {
      const list = await ctx.model.User.find(condition)
        .select('nickname avatar description')
        .skip(offset)
        .limit(size)
        .sort(sortName)
        .exec()
      const total = await ctx.model.User.count(condition)
      return {
        list: list,
        'total': total,
        'page': page,
        'size': size
      }
    } catch(err) {
      // ctx.throw(err)
      return {
        message: err.message
      }
    }
  }

  async logout(accessToken) {
    let { ctx } = this
    let condition = {
      accessToken: accessToken
    }
    try {
      await ctx.model.AccessToken.remove(condition)
      return {}
    } catch(err) {
      // ctx.throw(err)
      return {
        message: err.message
      }
    }
  }

  async changePassword(uid) {
    let { ctx } = this
    let old_password = String(ctx.query.old_password)
    let password = String(ctx.query.password)
    let message
    if(old_password === '') {
      message = '旧密码不能为空'
    } else if(password === '') {
      message = '密码不能为空'
    }
    if(message) {
      ctx.status = 422
      return ctx.body = {                                                                                             
        message: message
      }
    }
    try {
      const user = await ctx.model.User.findOne({_id: uid})
      // 生成密码hash，与服务器端对比，相同则认证通过，否则返回null
      if (user.hashedPassword !== ctx.model.User.encryptPassword(old_password, user.salt)) {
        ctx.status = 500
        return ctx.body = {
          message: 'old password error.'
        }
      }
      let params = {
        hashedPassword: ctx.model.User.encryptPassword(password, user.salt),
      }
      await ctx.model.User.findByIdAndUpdate(uid, params, {
        select: 'hashedPassword'
      })
      return {
      }
    } catch(err) {
      // ctx.throw(err)
      return {
        message: err.message
      }
    }
  }
}
module.exports = UserService;
