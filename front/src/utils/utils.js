import CanvasCompress from 'canvas-compress'
import {
  API_ROOT,
  QINIU_UPLOAD_ADDR,
  QINIU_IMG_ADDR,
  UPYUN_UPLOAD_ADDR,
  UPYUN_IMG_ADDR
} from '../config'
import SparkMD5 from 'spark-md5'
import Cookies from 'universal-cookie'
const cookie = new Cookies()
import { CookieDomain } from '../config'
let cookieConfig = {}
if(CookieDomain !== '') {
  cookieConfig = {
    domain: CookieDomain,
    maxAge: 604800
  }
}

export default {
  isLogin: function() {
    let flag01 = this.getCookie('username')
    let flag02 = this.getCookie('token')
    return !!(flag01 && flag02)
  },
  // check if this article is mine
  isMine: function(article) {
    let flag01 = this.getCookie('username')
    return !!(flag01 && article.author_id.nickname)
  },
  getCookie: function(name) {
    return cookie.get(name)
  },
  saveCookie: function(name, value) {
    cookie.set(name, value, cookieConfig)
  },
  removeCookie: function(name) {
    cookie.remove(name, cookieConfig)
  },
  uploadImgToQiniu: async function(file, save_dir, qiniuToken) {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isGIF = file.type === 'image/gif'
    const isWEBP = file.type === 'image/webp'
    const fz = file.size / 1024 // 换算成KB
    const isLt2M = fz / 1024 < 2 // 换算成MB后，判断是否小于2M

    if(!isJPG && !isPNG && !isGIF && !isWEBP) {
      return {
        res: false,
        message: '上传头像图片只能是 JPG/PNG/GIF 格式!'
      }
    }
    if(!isLt2M) {
      return {
        res: false,
        message: '上传头像图片大小不能超过 2MB!'
      }
    }
    // 上传文件到七牛云
    let filetype = ''
    if(file.type === 'image/png') {
      filetype = 'png'
    } else if(file.type === 'image/gif') {
      filetype = 'gif'
    } else if(file.type === 'image/webp') {
      filetype = 'webp'
    } else {
      filetype = 'jpg'
    }
    if(fz > 1024) {
      // 压缩
      const compressor = new CanvasCompress({
        type: file.type, // CanvasCompress.MIME.JPEG
        width: 2144,
        height: 1424,
        quality: 0.9, // 输出图片的质量，最高1
      });

      let {
        source,
        result
      } = await compressor.process(file)
      if (result.blob.size < file.size)
        file = result.blob
    }

    // https://serversideup.net/uploading-files-vuejs-axios/
    // 重命名要上传的文件
    /*let curr = Vue.moment().format('YYYYMMDD').toString()
    let prefix = Vue.moment(file.lastModified).format('HHmmss').toString()
    let suffix = file.name
    let keyname = encodeURI(`/hicool/${curr}/${prefix}_${suffix}`)*/
    const keyname = save_dir + '/' + new Date().getTime() + Math.floor(Math.random() * 100) + '.' + filetype
    // 从后端获取上传凭证token
    let formdata = new FormData()
    formdata.append('file', file)
    formdata.append('token', qiniuToken)
    formdata.append('key', keyname)
    // 获取到凭证之后再将文件上传到七牛云空间
    let res = await axios.post(QINIU_UPLOAD_ADDR, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    if(200 != res.status) {
      return {
        res: false,
        message: error.response.status + ' ' + error.response.data.error
      }
    }
    var imageUrl = QINIU_IMG_ADDR + '/' + res.data.key
    return Promise.resolve({
      res: true,
      message: imageUrl
    })
  },
  uploadImgToUpyun: async function(file, save_dir) {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isGIF = file.type === 'image/gif'
    const fz = file.size / 1024 // 换算成KB
    const isLt2M = fz / 1024 < 2 // 换算成MB后，判断是否小于2M

    if(!isJPG && !isPNG && !isGIF) {
      return {
        res: false,
        message: '上传头像图片只能是 JPG/PNG/GIF 格式!'
      }
    }
    if(!isLt2M) {
      return {
        res: false,
        message: '上传头像图片大小不能超过 2MB!'
      }
    }
    // 上传文件到七牛云
    let filetype = ''
    if(file.type === 'image/png') {
      filetype = 'png'
    } else if(file.type === 'image/gif') {
      filetype = 'gif'
    } else {
      filetype = 'jpg'
    }
    let blob = file
    if(fz > 512) {
      // 压缩
      const compressor = new CanvasCompress({
        type: file.type, // CanvasCompress.MIME.JPEG
        width: 1920,
        height: 1080,
        quality: 0.5, // 输出图片的质量，最高1
      });

      let {
        source,
        result
      } = await compressor.process(file)
      blob = result.blob
    }

    // '/static/article/tmp/'
    const save_as = save_dir + '/' + new Date().getTime() + Math.floor(Math.random() * 100) + '.' + filetype
    let upyun = await axios.get(API_ROOT + 'upload/getUpyunToken?save_as=' + save_as + '&size=' + blob.size, {
      headers: {
        'Authorization': 'Bearer ' + this.getCookie('token')
      }
    })
    var imageUrl = UPYUN_IMG_ADDR + save_as

    var xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function(event) {
      if(event.lengthComputable) {
        var percent = Math.round(event.loaded * 100 / event.total);
        console.log(percent + "%");
      };
    };
    xhr.onload = function(event) {
      if(xhr.status == 200) {
        console.log("上传 " + imageUrl + " 成功");
        return Promise.resolve({
          res: true,
          message: imageUrl
        })
      } else {
        console.log("上传 " + imageUrl + " 失败:" + JSON.parse(xhr.responseText).code);
      }
    };
    xhr.open('PUT', UPYUN_UPLOAD_ADDR + upyun.data.save_path, true);
    xhr.setRequestHeader("Authorization", upyun.data.Authorization);
    xhr.setRequestHeader("X-Date", upyun.data.X_Date);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(blob);
    return Promise.resolve({
      res: true,
      message: imageUrl
    })
  },
}

async function compress(file) {
  const compressor = new CanvasCompress({
    type: file.type, // CanvasCompress.MIME.JPEG
    width: 1920,
    height: 1080,
    quality: 0.5, // 输出图片的质量，最高1
  });

  let {
    source,
    result
  } = await compressor.process(file)
  return Promise.resolve(result.blob) //只要在这里返回一个立即resolve的Promise对象，压缩后的文件作为参数即可实现压缩
}
