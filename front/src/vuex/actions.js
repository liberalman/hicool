import { API_ROOT } from '../config'
import * as types from './mutation-types'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import utils from '../utils/utils'
import AES from '../utils/aes'

//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 增
function POST (url, params) {
  return revoke('POST', API_ROOT, url, params)
}
function POST_1 (url, params) {
  return revoke1('POST', API_ROOT, url, params)
}

// 删
function DELETE (url, params) {
  return revoke('DELETE', API_ROOT, url)
}

// 改
function PUT (url, params) {
  return revoke('PUT', API_ROOT, url, params)
}

// 查
function GET (url, params) {
  return revoke('GET', API_ROOT, url)
}

function revoke1 (method, API_ROOT, url, params) {
  const headers = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return doit(method, API_ROOT, url, headers, params)
}

function revoke (method, API_ROOT, url, params) {
  const headers = {
    headers: {
      'Authorization': 'Bearer ' + utils.getCookie('token')
    }
  }
  return doit(method, API_ROOT, url, headers, params)
}

function doit (method, API_ROOT, url, headers, params) {
  return new Promise((resolve, reject) => {
    console.log(params)
    if (params && params.content) {
      //var keys = AES.generatekey(16);
      //如果是对象/数组的话，需要先JSON.stringify转换成字符串
      //var encrypts = AES.encrypt(JSON.stringify(cars), keys);
      var key = 'YZh8yKD8Rv0CI1Dm'
      params.content = AES.encrypt(params.content, key)
    }
    console.log(params)
    url = sign(method, API_ROOT + url, params)
    let ret = {}
    if (method === 'POST') {
      ret = axios.post(url, params, headers)
    } else if (method === 'PUT') {
      ret = axios.put(url, params, headers)
    } else if (method === 'DELETE') {
      ret = axios.delete(url, headers)
    } else if (method === 'GET') {
      ret = axios.get(url, headers)
    } else {
      let err = 'no this method:' + method
      reject(err)
      return
    }
    ret.then(response => {
      resolve(response.data)
    })
      .catch((error) => {
        let err = `${error.response.status} ${error.response.statusText}, ${error.response.data.message}`
        reject(err)
      })
  })
}

export default {
  getArticles (page, size, tagId) {
    return GET(`/articles?page=${page}&size=${size}&sort_name=updated&tag_id=${tagId}`)
  },
  //  获取我的文章列表, type=2 私密文章
  getMyArticles(page, size, tagId, type) {
    return GET(`/myarticles?page=${page}&size=${size}&sort_name=updated&tag_id=${tagId}&type=${type}`)
  },
  //  获取我收藏的文章
  getLikes(page, size) {
    return GET(`/likes?page=${page}&size=${size}`)
  },
  getArticle (id, isAuthed) {
    if (isAuthed) {
      return GET(`/article/${id}`)
    } else {
      return GET(`/article/${id}`)
    }
  },
  // 根据 文章 id 获取 comments
  getComments (id) {
    return GET(`/comment/${id}/list`)
  },
  getCaptcha () {
    return GET(`/user/captcha?${Math.random()}`)
  },
  login (email, password, captcha) {
    return POST_1(
      `/user/login`,
      `password=${password}&captcha=${captcha}&client_id=web&client_secret=fskefgtarwdbawydrawpdpaiuiawdtg&grant_type=password&username=${email}`)
  },
  logout () {
    return POST(`/user/logout`)
  },
  register(nickname, email, password, captcha) {
    return POST('/user', `{"nickname":"${nickname}","email":"${email}","password":"${password}","captcha":"${captcha}"}`)
  },
  // 获取相册列表
  getAlbums(page, size, sortName) {
    return GET(`/albums?page=${page}&size=${size}&sort_name=${sortName}`)
  },
  // 获取相册
  getAlbum(id) {
    return GET(`/album/${id}`)
  },
  deletePhoto (gallery_id, photo_id) {
    return DELETE(`/album/${gallery_id}/${photo_id}`)
  },
  addPhoto (gallery_id, data) {
    return POST(`/album/${gallery_id}/add_photo`, data)
  },
  getQiniuToken() {
    let ret = GET(`/third/qiniu_token`)
    ret.catch(error => {
      return POST(`/third/qiniu_token`, null)
    })
    return ret
  },
  getUser(id) {
    if (id === 'me')
      return GET('/me')
    else
      return GET(`/user/${id}`)
  },
  createArticle (data) {
    return POST(`/article`, data)
  },
  deleteArticle (id) {
    return DELETE(`/article/${id}`)
  },
  updateArticle (id, data) {
    return PUT(`/article/${id}`, data)
    // return PUT(`/article/${id}/update`, data)
  },
  toggleLikeArticle (id) {
    return POST(`/article/${id}/toggle_like`)
  },

  /* timeline */
  createTimeline (data) {
    return POST(`/timeline`, data)
  },
  deleteTimeline (id) {
    return DELETE(`/timeline/${id}`)
  },
  updateTimeline (id, data) {
    return PUT(`/timeline/${id}`, data)
  },
  getTimeline (id, page, size) {
    return GET(`/timeline/${id}?page=${page}&size=${size}`)
  },
  getMyTimelines (page, size) {
    return GET(`/timelines?page=${page}&size=${size}&sort_name=updated`)
  },
  createPoint (data) {
    return POST(`/point`, data)
  },
  deletePoint (timelineId, pointId) {
    return DELETE(`/point/${timelineId}/${pointId}`)
  },
  updatePoint (timelineId, pointId, data) {
    delete data.timeline_id
    return PUT(`/point/${timelineId}/${pointId}`, data)
  },

  // 提交评论
  createComment(articleId, content) {
    return POST(`/comment/${articleId}`, { content: content })
  },
  deleteComment(commentId) {
    return DELETE(`/comment/${commentId}`, null)
  },
  createReply(commentId, toUserId, content) {
    return POST(`/comment/${commentId}/reply`, { toUserId: toUserId, content: content })
  },
  deleteReply(commentId, replyId) {
    return DELETE(`/comment/${commentId}/${replyId}`, null)
  },
  getTags () {
    return GET(`/tags`)
    //return GET(`/tag/list`)
  },
  getTip (id) {
    return GET(`/tip/${id}`)
  },
  getTips (page, size) {
    return GET(`/tips?page=${page}&size=${size}`)
  },
  getTipIndex () {
    return GET(`/tip`)
  },
  search (page, size, key) {
    return GET(`/search?page=${page}&size=${size}&sort_name=updated&key=${key}`)
  },
}

// body 是必须json格式的字符串
function sign (method, url, body) {
  var appId = '100078'
  var nowTime = Date.parse(new Date()) / 1000
  var appSecret = '2d25961ddbe5433379d96deee3a5a619'

  if (url.indexOf('?') >= 0) {
    url = url + '&'
  } else { // 没找到？号
    url = url + '?'
  }
  url += 'timestamp=' + nowTime + '&app_id=' + appId

  var parseUrl = function (url) {
    var result = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.exec(url)
    return result
  }

  var generateParamsArrayForSign = function (queryString, bodyData, time) {
    var rawParam = (queryString || '').split('&')
    var modifiedQueryString = ''
    var params = []
    var contentType = 'application/json;charset=UTF-8'

    for (let i in rawParam) {
      modifiedQueryString += (rawParam[i] + '&')
    }

    modifiedQueryString = modifiedQueryString.substring(0, modifiedQueryString.length - 1)

    params = (modifiedQueryString || '').split('&')

    if (method === 'POST') {
      if (contentType.indexOf('application/json') >= 0 && bodyData && bodyData.length > 0) {
        params.push('jsonBody=' + bodyData)
      } else if (contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
        for (let key in bodyData) {
          if (bodyData[key].constructor === Array) {
            for (let a in bodyData[key]) {
              params.push(key + '=' + bodyData[key][a])
            }
          } else {
            params.push(key + '=' + bodyData[key])
          }
        }
      }
    }

    return params.sort()
  }

  var generateSign = function (path, params, appSecret) {
    var signStr = method + path + '?'
    var token = ''

    for (let i in params) {
      if (params[i].indexOf('sign=') === 0) {
        continue
      } else {
        signStr += (params[i] + '&')
      }
    }
    signStr = signStr.substring(0, signStr.length - 1)
    signStr += appSecret
    signStr += token
    return CryptoJS.MD5(signStr).toString()
  }

  var urlParseObj = parseUrl(url)
  var queryParams = generateParamsArrayForSign(urlParseObj[6], body, nowTime)
  var sign = generateSign('/' + urlParseObj[5], queryParams, appSecret)
  url = url + '&sign=' + sign
  return url
}
