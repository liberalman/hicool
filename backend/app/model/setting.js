/** 
 * 
 */
'use strict'

module.exports = app => {
  const mongoose = require('mongoose')
  const Schema = mongoose.Schema

  let SettingSchema = new Schema({
    clean_resource: {
      marker: String,
    },
  })

  return mongoose.model('Setting', SettingSchema)
}
