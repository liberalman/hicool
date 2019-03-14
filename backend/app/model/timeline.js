/** 
 * 时光轴表
 */
'use strict'

module.exports = app => {
  const mongoose = require('mongoose')
  const Schema = mongoose.Schema

  let TimelineSchema = new Schema({
    author_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String
    },
    description: String,
    cover: String,
    points: {
      type: Array
    },
    top: {
      type: Boolean,
      default: false
    },
    status: { //0:草稿 1:发布
      type: Number,
      default: 0
    },
    created: {
      type: Date,
      default: Date.now
    },
    publish_time: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }
  })

  TimelineSchema
    .virtual('info')
    .get(function() {
      return {
        'author_id': this.author_id,
        '_id': this._id,
        'title': this.title,
        'description': this.description,
        'points': this.points,
        'cover': this.cover,
        'publish_time': this.publish_time,
      }
    })

  return mongoose.model('Timeline', TimelineSchema)
};