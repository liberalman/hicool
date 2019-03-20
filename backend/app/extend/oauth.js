'use strict';

const crypto = require('crypto')
const tools = require('./tools')

//生成密码
function encryptPassword(password, salt) {
  if (!password || !salt) return ''
  var salt = new Buffer(salt, 'base64')
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64')
}

// need implement some follow functions
module.exports = app => { 
  class Model {
    constructor(ctx) {
      this.ctx = ctx
    }

    // password模式验证需要扩展以下几个方法，详情见
    // https://github.com/Azard/egg-oauth2-server

    
    // password mode app.oauth.token() lifecycle
    // getClient --> getUser --> saveToken
    /**
     * 进行客户端验证的默认回调函数
     * @clientId 申请应用时分配的APP ID
     * @clientSecret 对应的秘钥
     */
    async getClient(clientId, clientSecret) {
      try {
        console.log(`getClient (${clientId}, ${clientSecret}) invoked.......`)
        tools.DEBUG(`getClient (${clientId}, ${clientSecret}) invoked.......`)
        const client = await this.ctx.model.Client.findOne({clientId: clientId, secret: clientSecret});
        if (!client)
          return false
        return {
          clientId: client.clientId,
          redirectUris: client.redirectUri,
          grants: client.grants,
          clientSecret: client.secret
        }
        /*return {
          clientId: 'myClientId',
          clientSecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 
          redirectUri: 'http://127.0.0.1:7002/auth/redirect', // 授权回调地址, 必须和申请应用是填写的一致(参数部分可不一致)
          grants: ['password']
        }*/
      } catch (err) {
        return false
      }
    }
    
    // 进行用户验证
    async getUser(username, password) {
      try {
        console.log(`getUser (${username}, ${password}) invoked.......`)
        const user = await this.ctx.model.User.findOne({email: username})
        // 生成密码hash，与服务器端对比，相同则认证通过，否则返回null
        if (user.hashedPassword !== encryptPassword(password, user.salt))
          return null
        return {
          userId: user._id,
          name: user.nickname,
          email: user.email,
          avatar: user.avatar
        }
      } catch (err) {
        return false
      }
    }
    
    // password mode app.oauth.authenticate() lifecycle
    // Only getAccessToken
    // 校验token
    async getAccessToken(bearerToken) {
      try {
        console.log(`getAccessToken (${bearerToken}) invoked.......`)
        const token = await this.ctx.model.AccessToken.findOne({accessToken: bearerToken})
        if (!token)
          // token验证不通过
          return
        // token验证通过，返回token详情
        return {
          accessToken: token.accessToken,
          accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
          scope: token.scope,
          client: {
            id: token.clientId
          },
          user: {
            id: token.userId
          }
        }
      } catch (err) {
        return false
      }
    }
    
    // 保存token
    async saveToken(token, client, user) {
      try {
        console.log('saveToken invoked.......')
        var accessTokenExpiresAt = new Date(token.accessTokenExpiresAt); 
        accessTokenExpiresAt.setDate(accessTokenExpiresAt.getDate() + 7); // 7天有效期
        await this.ctx.model.AccessToken.create({
          accessToken: token.accessToken,
          accessTokenExpiresAt: accessTokenExpiresAt,
          clientId: client.clientId,
          userId: user.userId,
          scope: token.scope || ''
        })
        
        var refreshTokenExpiresAt = new Date(token.refreshTokenExpiresAt); 
        refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7); // 7天有效期
        await this.ctx.model.RefreshToken.create({
          refreshToken: token.refreshToken,
          refreshTokenExpiresAt: refreshTokenExpiresAt,
          clientId: client.clientId,
          userId: user.userId,
          scope: token.scope || ''
        })
        
        return {
          accessToken: token.accessToken,
          accessTokenExpiresAt: accessTokenExpiresAt,
          refreshToken: token.refreshToken,
          refreshTokenExpiresAt: refreshTokenExpiresAt,
          client: { id: client.clientId },
          user: user
        }
      } catch (err) {
        return false
      }
    }
    
    //
    async revokeToken(token) {
      try {
        return await this.ctx.model.RefreshToken.delRefreshToken(token)
      } catch (err) {
        return false
      }
    }
    
    async getRefreshToken(refreshToken) {
      try {
        const refToken = await this.ctx.model.RefreshToken.queryRefreshToken(refreshToken)
        if (!refToken) return
        const user = await this.ctx.model.User.queryUser({ id: refToken.userId })
        if (!user) return
        return {
          refreshToken: refToken.refreshToken,
          refreshTokenExpiresAt: refToken.refreshTokenExpiresAt,
          scope: refToken.scope,
          client: { id: refToken.clientId }, // with 'id' property
          user: user
        }
      } catch (err) {
        return false
      }
    }
    
    // 获取授权码的方式，这里不适用
    // 字段设定可以参考小米的第三方服务接口标准，定制了我们的 https://dev.mi.com/docs/passport/authorization-code/
    async getAuthorizationCode(authorizationCode) {
      try {
        console.log('authorizationCode: ', authorizationCode)
        /*const authCode = await this.ctx.model.AuthorizationCode.queryAuthorizationCode({
          code: authorizationCode
        })
        if (!authCode)
          return
        const user = await this.ctx.model.User.queryUser({ id: authCode.userId })
        if (!user)
          return
        return {
          code: authCode.code,
          expiresAt: authCode.expiresAt,
          redirectUri: authCode.redirectUri,
          scope: authCode.scope,
          client: { id: authCode.clientId },
          user: user
        }*/
        return {
          code: authorizationCode,
          expiresAt: '2019-10-10',
          redirectUri: 'http://127.0.0.1:7002/auth/redirect',
          scope: 'auth_user', // 申请scope权限所需参数，可一次申请多个scope权限，用空格分隔，
          /*
           * SCOPE权限列表
scope 权限描述  API说明
1 获取小米用户个人资料  user/profile
2 获取米聊用户好友关系列表  user/relation
3 获取小米用户OpenId  user/openIdV2
4 获取小米用户绑定的安全手机号  user/phoneAndEmail
6 获取小米用户绑定的安全邮箱 user/phoneAndEmail
1000  访问小米用户的小米路由器  路由器
2000  获取小米用户存储在小米云中的联系人信息 小米云
6000  使用小米用户的智能家庭服务 小米云
7000  关注黄页app对应服务号(黄页应用默认开启)  小米云
11000 获取小米用户的云相册数据  小米云
12001 保存应用的数据到小米云中  小米云
13002 存储小米用户的健身运动数据信息到小米云中  小米云
16000 获取您的小米卡包卡券  MIUI
           */
          client: { id: 'hyewfbgawd' },
          user: {
            name: 'test',
            password: '123456',
            age: 23,
            firstname: 'shouchao',
            lastname: 'zheng',
          }
        }
      } catch (err) {
        return false
      }
    }
    async saveAuthorizationCode(code, client, user) {
      try {
        await this.ctx.model.AuthorizationCode.saveAuthorizationCode(code, client, user)
        return {
          authorizationCode: code.authorizationCode,
          expiresAt: code.expiresAt,
          redirectUri: code.redirectUri,
          scope: code.scope,
          client: { id: client.id },
          user: { id: user.id }
        }
      } catch (err) {
        return false
      }
    }
    async revokeAuthorizationCode(code) {
      try {
        return await this.ctx.model.AuthorizationCode.delAuthorizationCode
      } catch (err) {
        return false
      }
    }
  }
  return Model;
};
