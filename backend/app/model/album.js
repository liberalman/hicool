/** 
 * 文章表
 */
'use strict'

module.exports = app => {
  const mongoose = require('mongoose')
  const Schema = mongoose.Schema

  let AlbumSchema = new Schema({
    author_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: String,
    content: String,
    cover: String,
    images: {
      type: Array
    },
    top: {
      type: Boolean,
      default: false
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

  AlbumSchema
    .virtual('info')
    .get(function() {
      return {
        'author_id': this.author_id,
        '_id': this._id,
        'title': this.title,
        'content': this.content,
        'images': this.images,
        'cover': this.cover,
        'publish_time': this.publish_time,
      }
    })

  return mongoose.model('Album', AlbumSchema)
};