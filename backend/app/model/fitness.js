/** 
 * 文章表
 */
'use strict'

module.exports = app => {
  const mongoose = require('mongoose')
  const Schema = mongoose.Schema

  let FitnessSchema = new Schema({
    author_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    segmental_muscle: {
      type: Array
    },
    segmental_fat: {
      type: Array
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }],
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
    },
    height: {
      type: Number,
      default: 0
    },
    age: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    },
    VFI: {
      type: Number,
      default: 0
    },
    need_kcal: {
      type: Number,
      default: 0
    },
    need_fat: {
      type: Number,
      default: 0
    },
    examination_time: {
      type: Date,
      default: 0
    },
    gender: {
      type: Boolean,
      default: true
    },
    weight: {
      type: Object,
      default: {
        current: {
          type: Number,
          default: 0
        },
        low: {
          type: Number,
          default: 52.8
        },
        high: {
          type: Number,
          default: 71.4
        },
      }
    },
    skeletal_muscle: {
      type: Object,
      default: {
        current: {
          type: Number,
          default: 0
        },
        low: {
          type: Number,
          default: 26.4
        },
        high: {
          type: Number,
          default: 32.2
        },
      }
    },
  })

  return mongoose.model('Fitness', FitnessSchema)
}
