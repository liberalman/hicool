import axios from 'axios'
import CryptoJS from 'crypto-js'

// let baseUrl = 'http://localhost:8700/api/v1/admin'
let baseUrl = 'https://www.hicool.top/api/v1/admin'

// 增
/*
function POST (url, params) {
  return revoke('POST', baseUrl, url, params)
}
*/

// 增
function POST_LOGIN (url, params) {
  return revoke1('POST', baseUrl, url, params)
}

// 删
function DELETE (url, params) {
  return revoke('GET', baseUrl, url, null)
}

// 改
function PUT (url, params) {
  return revoke('PUT', baseUrl, url, params)
}

// 查
function GET (url, params) {
  return revoke('GET', baseUrl, url, null)
}

function revoke (method, baseUrl, url, params) {
  const token = 'Bearer '
  const headers = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': token
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

function revoke1 (method, baseUrl, url, params) {
  const headers = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return new Promise((resolve, reject) => {
    url = baseUrl + url
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
        let err = `${error.response.status} ${error.response.statusText}, ${error.response.data.error_description}`
        reject(err)
      })
  })
}

export default {
  getTags (tagCategoryId) { // 0代表所有类型的tag全部获取，而其余的标签类型id，代表获取该类型下的所有标签。
    // return GET(`/tag/${tagCategoryId}/list`)
    return GET(`/tags`)
  },
  getUsers (page, size) {
    return GET(`/users?page=${page}&size=${size}&sort_name=created&sort_order=false`)
  },
  login (email, password, captcha) {
    let secret = ''
    // return POST_AUTH(`/local/login`, `{"email":"${email}","password":"${password}","captcha":"${captcha}"}`)
    var params = new URLSearchParams()
    params.append('username', email)
    params.append('password', password)
    params.append('captcha', captcha)
    params.append('grant_type', 'password')
    params.append('client_id', 'web')
    params.append('client_secret', secret)
    return POST_LOGIN('/user/login', params)
  },
  getMe () {
    return GET('/users/me')
  },
  getUser (id) {
    return GET(`/user/${id}`)
  },
  updateUser (user) {
    return PUT(`/user/${user._id}/update`)
  },
  getArticles (page, size, sortOrder, filterTitle) {
    return GET(`/articles?page=${page}&size=${size}&sort_name=updated&sort_order=${sortOrder}&filter_title=${filterTitle}`)
  },
  deleteArticle (id) {
    return DELETE(`/article1/${id}`)
  },
  getAlbums (page, size, sortOrder) {
    return GET(`/albums?page=${page}&size=${size}&sort_name=updated&sort_order=${sortOrder}`)
  },
  getAlbum (id) {
    return GET(`/album/${id}`)
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
      if (contentType.indexOf('application/json') >= 0 && bodyData.length > 0) {
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
