"use strict"

const _ = require('lodash')

//从markdown中提取图片
exports.extractImage = function(content) {
  let results = []
  const images = content.match(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g)
  if(_.isArray(images) && images.length > 0) {
    for(let i = 0, j = images.length; i < j; i++) {
      var url = images[i].replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/, function($1, m1, m2, m3, m4) {
        return m4 || ''
      })
      if(url !== '') {
        results.push({
          url: url
        })
      }
    }
  }
  return results
}