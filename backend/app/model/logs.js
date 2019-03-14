'use strict'

module.exports = app => {
  const mongoose = require('mongoose')
  const Schema = mongoose.Schema

  let LogsSchema = new Schema({
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      trim: true
    },
    type: String,
    created: {
      type: Date,
      default: Date.now
    }
  })

  return mongoose.model('Logs', LogsSchema)
};