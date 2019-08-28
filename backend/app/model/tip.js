/** 
 * 文章表
 */
'use strict'

module.exports = app => {
  const mongoose = require('mongoose')
  const Schema = mongoose.Schema

  let TipSchema = new Schema({
    content: String,
    cover: String,
  })

  TipSchema
    .virtual('info')
    .get(function() {
      return {
        '_id': this._id,
        'content': this.content,
        'cover': this.cover,
      }
    })

  return mongoose.model('Tip', TipSchema)
}
