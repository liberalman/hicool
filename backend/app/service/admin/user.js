// app/service/user.js
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
    this.root = 'https://cnodejs.org/api/v1';
  }

  async create(params) {
    let {
      ctx
    } = this
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
      let newUser = new this.ctx.model.User(ctx.request.body)
      newUser.role = 'user'
      const user = await newUser.save()
      await this.ctx.model.Logs.create({
        uid: ctx.req.user._id,
        content: '创建新用户 ' + (user.email || user.nickname),
        type: 'user'
      })
      ctx.status = 200
      ctx.body = {
        user_id: user._id
      }
    } catch(err) {
      // ctx.throw(err)
      ctx.status = 500
      ctx.body = {
        message: err.message
      }
    }
  }

  async delete(uid) {
    const userId = ctx.req.user._id
    if(String(userId) === String(uid)) {
      ctx.status = 403
      return ctx.body = {
        message: '不能删除自己已经登录的账号'
      }
    } else {
      try {
        const user = await this.ctx.model.User.findByIdAndRemove(uid)
        await this.model.Logs.create({
          uid: userId,
          content: '删除用户' + (user.email || user.nickname),
          type: 'user'
        })
        ctx.status = 200
      } catch(err) {
        // ctx.throw(err)
        ctx.status = 500
        return {
          message: err.message
        }
      }
    }
  }

  async update(uid) {
    const {
      ctx
    } = this;
    //被编辑人
    const nickname = ctx.request.body.nickname ? ctx.request.body.nickname.replace(/(^\s+)|(\s+$)/g, '') : ''
    const email = ctx.request.body.email ? ctx.request.body.email.replace(/(^\s+)|(\s+$)/g, '') : ''
    const NICKNAME_REGEXP = /^[(\u4e00-\u9fa5)0-9a-zA-Z\_\s@]+$/
    const EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    let message
    /*if(nickname === '') {
      message = '呢称不能为空'
    } else if(email === '') {
      message = '邮箱地址不能为空'
    } else */
    if(nickname != '' && (nickname.length <= 2 || nickname.length > 15 || !NICKNAME_REGEXP.test(nickname))) {
      //不符合呢称规定.
      message = '呢称不合法'
    } else if(email != '' && (email.length <= 4 || email.length > 30 || !EMAIL_REGEXP.test(email))) {
      message = '邮箱地址不合法'
    }
    if(message) {
      ctx.status = 422
      return ctx.body = {
        message: message
      }
    }
    try {
      let user = await ctx.model.User.findById(uid)
      if(nickname != '') {
        user.nickname = ctx.request.body.nickname
      }
      if(email != '') {
        user.email = ctx.request.body.email.toLowerCase()
      }
      if(ctx.request.body.status) {
        user.status = ctx.request.body.status
      }
      if(ctx.request.body.newPassword) {
        user.password = ctx.request.body.newPassword
      }
      const newUser = await user.save()
      await ctx.model.Logs.create({
        email: 'xxxx',
        content: '编辑用户' + (newUser.email || newUser.nickname),
        type: 'user'
      })
      ctx.status = 200
      ctx.body = {
        user_id: newUser._id
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
    if(result.status !== 200) {
      const errorMsg = result.data && result.data.error_msg ? result.data.error_msg : 'unknown error';
      this.ctx.throw(result.status, errorMsg);
    }
    if(!result.data.success) {
      // 远程调用返回格式错误
      this.ctx.throw(500, 'remote response error', {
        data: result.data
      });
    }
  }

  async find(uid) {
    try {
      // 假如 我们拿到用户 id 从数据库获取用户详细信息
      const user = await this.ctx.model.User.findOne({
        _id: uid
      })
      .select('-hashedPassword -salt')
      return user
    } catch(err) {
      // ctx.throw(err)
      return {
        message: err.message
      }
    }
  }

  async me(uid) {
    const user = await this.ctx.model.User.findOne({
        _id: uid
      })
      .select('nickname avatar email description status')
    return user
  }

  async getPicture(uid) {
    const result = await this.ctx.curl(`http://photoserver/uid=${uid}`, {
      dataType: 'json'
    });
    return result.data;
  }

  async list() {
    let {
      ctx
    } = this
    let page = (parseInt(ctx.query.page) > 0) ? parseInt(ctx.query.page) : 1
    let size = (parseInt(ctx.query.size) > 0) ? parseInt(ctx.query.size) : 10
    let offset = (page - 1) * size

    let sort_name = String(ctx.query.sort_name) || 'created'
    let sort_order = ctx.query.sort_order
    if(sort_order === 'false') {
      sort_name = '-' + sort_name
    }
    try {
      const count = await this.ctx.model.User.count()
      const userList = await this.ctx.model.User.find({}).skip(offset).limit(size).sort(sort_name).exec()
      return {
        list: userList,
        total: count,
        page: page,
        size: size
      }
    } catch(err) {
      ctx.throw(err)
      return {
        message: err.message
      }
    }
  }
}
module.exports = UserService;