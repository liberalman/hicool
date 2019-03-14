'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const AuthorizationCodeSchema = new mongoose.Schema({
    code: String,
    expiresAt: Date,
    redirectUri: String,
    scope: String,
    clientId: String,
    userId: {
      type: Number,
      allowNull: false
    }
  })
  return mongoose.model('AuthorizationCode', AuthorizationCodeSchema)
  /*
  const AuthorizationCode = app.model.define('authorizationCode', {
    code: String,
    expiresAt: Date,
    redirectUri: String,
    scope: String,
    clientId: String,
    userId: { type: Integer, allowNull: false }
  }, {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      freezeTableName: true
    });

  AuthorizationCode.saveAuthorizationCode = async function (code, client, user) {
    return await this.create({
      code: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope || '',
      clientId: client.id,
      userId: user.id
    })
  }

  AuthorizationCode.queryAuthorizationCode = async function(params) {
    return await this.findOne({
      where: params
    })
  }

  AuthorizationCode.delAuthorizationCode = async function(code) {
    return await this.destroy({
      where: {
        code: code
      }
    })
  }

  return AuthorizationCode;*/
};