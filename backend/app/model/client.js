'use strict'

module.exports = app => {
  let ClientSchema = new app.mongoose.Schema({
    clientId: { type: String, unique: true },
    clientSecret: { type: String },
    redirectUri: String,
    grants:[{
        type:String
    }]
  }, {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    freezeTableName: true
  })
  
  ClientSchema.methods = {
    //检查用户权限
    hasRole: function(role) {
        var selfRoles = this.role
        return (selfRoles.indexOf('admin') !== -1 || selfRoles.indexOf(role) !== -1)
    },
    //验证用户密码
    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashedPassword
    },
    //生成盐
    makeSalt: function() {
      return crypto.randomBytes(16).toString('base64')
    }
  }
  
  return app.mongoose.model('Client', ClientSchema)
};


