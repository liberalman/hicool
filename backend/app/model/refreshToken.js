'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const RefreshTokenSchema = new mongoose.Schema({
    refreshToken: { type: String, unique: true },
    refreshTokenExpiresAt: Date,
    createAt: Date,
    scope: String,
    clientId: String,
    userId: { type: String, allowNull: false }
  })
  return mongoose.model('RefreshToken', RefreshTokenSchema)
  /*
  const RefreshToken = app.model.define('refreshToken', {
    refreshToken: {type: String, unique: true},
    refreshTokenExpiresAt: Date,
    scope: String,
    clientId: String,
    userId: { type: String, allowNull: false }
  }, {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      freezeTableName: true
    });

  RefreshToken.saveRefreshToken = async function (token, client, user) {
    await this.create({
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        clientId: client.id,
        userId: user.id,
        scope: token.scope || ''
    })
  }
  
  RefreshToken.delRefreshToken = async function(token) {
    return await this.destroy({
      where: {
        refreshToken: token.refreshToken
      }
    })
  }

  RefreshToken.queryRefreshToken = async function(refreshToken) {
    return await this.findOne({
      where: {
        refreshToken: refreshToken
      }
    })
  }

  return RefreshToken;*/
};
