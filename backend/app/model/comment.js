/**
 * 评论表
 */
'use strict'

module.exports = app => {
  const mongoose = require('mongoose')
  const Schema = mongoose.Schema
  
  let CommentSchema = new Schema({
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    likeNum:  {
      type: Number,
      default: 0
    },
    content: String,
    //针对评论的回复
    replys: [{
      content: String, //回复内容
      fromUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      toUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      created: Date
    }],
    status: { //0,删除,1,正常
      type: Number,
      default: 1
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }
  })
  
  //exports.CommentSchema = CommentSchema
  //module.exports = mongoose.model('Comment', CommentSchema)
  return mongoose.model('Comment', CommentSchema)
}