/** 
 * 表
 */
'use strict'

module.exports = app => {
  const mongoose = require('mongoose')
  const Schema = mongoose.Schema

  let FriendSchema = new Schema({
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    },
    //存储文章所用到的图片
    images: {
      type: Array
    },
  })

  return mongoose.model('Friend', FriendSchema)
}
