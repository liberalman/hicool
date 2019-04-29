import { API_ROOT,API_ROOTA } from '../config'
import * as types from './mutation-types'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import utils from '../utils/utils'

//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['Content-Type'] = 'application/json'

let baseUrl = `${API_ROOT}/api/1/front`
let baseUrla = `${API_ROOTA}/api/v1/front`

// 增
function POST (url, params) {
  return revoke('POST', baseUrl, url, params)
}
function POSTA (url, params) {
  return revoke('POST', baseUrla, url, params)
}
function POSTA_1 (url, params) {
  return revoke1('POST', baseUrla, url, params)
}

// 增
function POST_AUTH (url, params) {
  return revoke('POST', `${API_ROOT}/auth`, url, params)
}

// 删
function DELETE (url, params) {
  return revoke('DELETE', baseUrl, url)
}
function DELETEA (url, params) {
  return revoke('DELETE', baseUrla, url)
}

// 改
function PUT (url, params) {
  return revoke('PUT', baseUrl, url, params)
}
function PUTA (url, params) {
  return revoke('PUT', baseUrla, url, params)
}

// 查
function GET (url, params) {
  return revoke('GET', baseUrl, url)
}
function GETA (url, params) {
  return revoke('GET', baseUrla, url)
}

function revoke1 (method, baseUrl, url, params) {
  const headers = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return new Promise((resolve, reject) => {
    url = sign(method, baseUrl + url, params)
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

function revoke (method, baseUrl, url, params) {
  const headers = {
    headers: {
      'Authorization': 'Bearer ' + utils.getCookie('token')
    }
  }
  return new Promise((resolve, reject) => {
    url = sign(method, baseUrl + url, params)
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
    // return GET(`/article/list?page=${page}&size=${size}&sort_name=updated&tag_id=${tagId}`)
    return GETA(`/articles?page=${page}&size=${size}&sort_name=updated&tag_id=${tagId}`)
  },
  //  获取我的文章列表, type=2 私密文章
  getMyArticles(page, size, tagId, type) {
    return GETA(`/myarticles?page=${page}&size=${size}&sort_name=updated&tag_id=${tagId}&type=${type}`)
    //return GET(`/article/mine?page=${page}&size=${size}&sort_name=updated&tag_id=${tagId}&type=${type}`)
  },
  //  获取我收藏的文章
  getLikes(page, size) {
    return GETA(`/likes?page=${page}&size=${size}`)
    //return GET(`/user/me/likes?page=${page}&size=${size}`)
  },
  getArticle (id, isAuthed) {
    if (isAuthed) {
      return GETA(`/article/${id}`)
      // return GET(`/article/${id}/authed`)
    } else {
      return GETA(`/article/${id}`)
      // return GET(`/article/${id}`)
    }
  },
  // 根据 文章 id 获取 comments
  getComments (id) {
    return GETA(`/comment/${id}/list`)
  },
  login (email, password, captcha) {
    return POSTA_1(`/user/login`, `password=${password}&captcha=${captcha}&client_id=web&client_secret=fskefgtarwdbawydrawpdpaiuiawdtg&grant_type=password&username=${email}`)
    //return POST_AUTH(`/local/login`, `{"email":"${email}","password":"${password}","captcha":"${captcha}"}`)
  },
  logout () {
    return POST(`/user/logout`)
  },
  register(nickname, email, password, captcha) {
    return POST_AUTH('/local/register', `{"nickname":"${nickname}","email":"${email}","password":"${password}","captcha":"${captcha}"}`)
  },
  // 获取相册列表
  getAlbums(page, size, sortName) {
    return GETA(`/albums?page=${page}&size=${size}&sort_name=${sortName}`)
    //return GET(`/album/list?page=${page}&size=${size}&sort_name=${sortName}`)
  },
  // 获取相册
  getAlbum(id) {
    return GETA(`/album/${id}`)
    //return GET(`/album/${id}`)
  },
  getQiniuToken() {
    //let ret = GET(`/upload/qiniu_token`)
    let ret = GETA(`/third/qiniu_token`)
    ret.catch(error => {
      return POSTA(`/third/qiniu_token`, null)
    })
    return ret
  },
  getUser(id) {
    if (id === 'me')
      return GETA('/me')
    else
      return GETA(`/user/${id}`)
    //return GET(`/user/${id}`)
  },
  createArticle (data) {
    return POSTA(`/article`, data)
    // return POST(`/article/create`, data)
  },
  deleteArticle (id) {
    //return DELETE(`/article/${id}`)
    return DELETEA(`/article/${id}`)
  },
  updateArticle (id, data) {
    return PUTA(`/article/${id}`, data)
    // return PUT(`/article/${id}/update`, data)
  },

  /* timeline */
  createTimeline (data) {
    return POSTA(`/timeline`, data)
  },
  deleteTimeline (id) {
    return DELETEA(`/timeline/${id}`)
  },
  updateTimeline (id, data) {
    return PUTA(`/article/${id}`, data)
  },
  getTimeline (id) {
    return GETA(`/timeline/${id}`)
  },
  getMyTimelines (page, size) {
    return GETA(`/timelines?page=${page}&size=${size}&sort_name=updated`)
  },

  // 提交评论
  createComment(articleId, content) {
    return POSTA(`/comment/${articleId}`, { content: content })
    //return POST(`/article/:id/comment/create`, data)
  },
  deleteComment(commentId) {
    return DELETEA(`/comment/${commentId}`, null)
    //return DELETE(`/article/:article_id/:comment_id`, data)
  },
  createReply(commentId, toUserId, content) {
    return POSTA(`/comment/${commentId}/reply`, { toUserId: toUserId, content: content })
  },
  deleteReply(commentId, replyId) {
    return DELETEA(`/comment/${commentId}/${replyId}`, null)
  },
  getTags () {
    return GETA(`/tags`)
    //return GET(`/tag/list`)
  }
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
