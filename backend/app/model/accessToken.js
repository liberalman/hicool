'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const AccessTokenSchema = new mongoose.Schema({
    accessToken: {
      type: String,
      unique: true
    },
    accessTokenExpiresAt: Date,
    scope: String,
    clientId: String,
    userId: {
      type: String,
      allowNull: false
    }
  })
  return mongoose.model('AccessToken', AccessTokenSchema)
  /*
  const AccessToken = app.model.define('accessToken', {
    accessToken: {type: String, unique: true},
    accessTokenExpiresAt: Date,
    scope: String,
    clientId: String,
    userId: { type: String, allowNull: false }
  }, {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      freezeTableName: true
    });

  AccessToken.getAccessToken = async function (bearerToken) {
    return await this.findOne({
      where: { accessToken: bearerToken }
    });
  }
  
  AccessToken.saveAccessToken = async function (token, client, user) {
    await this.create({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        clientId: client.id,
        userId: user.id,
        scope: token.scope || ''
    })
  }

  return AccessToken;*/
};