<template>
  <div class="wrapper">
    <div class="model" v-show="model" @click="model = false">
      <div class="model-show">
        <img :src="modelSrc" alt="">
      </div>
    </div>
    <div class="content">
      <div class="show-info">
        <div class="test">
          <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :fixedBox="option.fixedBox" :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :centerBox="option.centerBox" :high="option.high" @realTime="realTime" @imgLoad="imgLoad"></vueCropper>
        </div>
        <div class="test-button">
          <button @click="changeImg" class="btn">changeImg</button>
          <label class="btn" for="uploads">上传图片</label>
          <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
          <button @click="refreshCrop" class="btn">refresh</button>
          <button @click="changeScale(1)" class="btn"><i class="el-icon-circle-plus-outline"></i></button>
          <button @click="changeScale(-1)" class="btn"><i class="el-icon-remove-outline"></i></button>
          <button @click="rotateLeft" class="btn">rotateLeft</button>
          <button @click="rotateRight" class="btn">rotateRight</button>
          <button @click="finish('base64')" class="btn">预览</button>
          <a @click="setAvatar()" class="btn">确定修改</a>
        </div>
        预览
        <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
          <div :style="previews.div">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vueCropper from 'vue-cropper'
  import * as qiniu from 'qiniu-js' // https://github.com/qiniu/js-sdk
  import utils from '../../utils/utils'
  var hljs = require('highlight.js')

  export default {
    name: 'AvatarQiniu',
    data: function() {
      return {
        model: false,
        modelSrc: '',
        crap: false,
        previews: {},
        lists: [{
            img: 'http://image.hicool.top/static/album/2/1505056171190783772.jpeg'
          },
          {
            img: 'http://image.hicool.top/static/album/1/1503764913787592300.jpg'
          },
          {
            img: 'http://image.hicool.top/static/album/1/1505055081151460486.jpg',
          },
          {
            img: 'http://image.hicool.top/static/album/5ac0a4bac0979028323030f3/1503763889882028200.jpg',
          },
          {
            img: 'https://image.hicool.top/static/album/16/1505746956809493901.jpg'
          },
          {
            img: 'https://image.hicool.top/static/album/1/1512284392385753964.jpg'
          }
        ],
        option: {
          img: '',
          size: 1,
          full: false,
          outputType: 'jpg', // png,webp
          canMove: true,
          fixedBox: false,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 200,
          autoCropHeight: 150,
          centerBox: false,
          high: true
        },
      }
    },
    methods: {
      changeImg() {
        this.option.img = this.lists[~~(Math.random() * this.lists.length)].img
      },
      refreshCrop() {
        // clear
        this.$refs.cropper.refresh()
      },
      changeScale(num) {
        num = num || 1
        this.$refs.cropper.changeScale(num)
      },
      rotateLeft() {
        this.$refs.cropper.rotateLeft()
      },
      rotateRight() {
        this.$refs.cropper.rotateRight()
      },
      finish(type) { //用法 finish('base64') 或者 finish('blob')
        // 输出
        if(type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            var img = window.URL.createObjectURL(data)
            this.model = true
            this.modelSrc = img
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            this.model = true
            this.modelSrc = data
          })
        }
      },
      // 实时预览函数
      realTime(data) {
        this.previews = data
      },
      uploadImg(e, num) {
        //上传图片
        var file = e.target.files[0]
        if(!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        var reader = new FileReader()
        reader.onload = (e) => {
          let data
          if(typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if(num === 1) {
            this.option.img = data
          } else if(num === 2) {
            this.example2.img = data
          }
        }
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        reader.readAsArrayBuffer(file)
      },
      imgLoad(msg) {
        console.log(msg)
      },
      setAvatar(e) {
        let _this = this
        this.$refs.cropper.getCropBlob((file) => {
          var time = Date.now() //当前时间戳
          var token = this.$store.state.third.qiniuToken
          //var key = 'hicool/' + utils.getCookie('email') + '/avatar_' + time + '.png' // dest file name
          var key = 'hicool/' + utils.getCookie('email') + '/avatar.png' // dest file name
          var putExtra = {
            fname: "",
            params: {},
            mimeType: [] || null
          };
          var config = {};
          var observer = {
            next(res) {},
            error(err) {
              console.log(err)
              if(401 == err.code) {
                //更新七牛token
                _this.$message({
                  message: '需要更新七牛token',
                  type: 'error'
                });
              } else {
                _this.$message({
                  message: err.response,
                  type: 'error'
                });
              }
            },
            complete(res) {
              //console.log(res)
              _this.$message({
                message: 'success',
                type: 'success'
              });
            }
          }

          //图片上传前压缩
          let options = {
            quality: 0.92,
            noCompressIfLarger: false, // noCompressIfLarger的值为true,发现压缩后文件大小比原来还大，则使用原来图片，此属性可能会影响图片自动纠正功能
            // maxWidth: 1000,
            // maxHeight: 618
          }
          qiniu.compressImage(file, options).then(data => {
            console.log(data)
            var observable = qiniu.upload(data.dist, key, token, putExtra, config)
            var subscription = observable.subscribe(observer) // 上传开始
          })
        })
      }
    },
    components: {
      vueCropper
    },
    created() {
      this.$store.dispatch('third/getQiniuToken')
    },
    mounted() {
      this.changeImg()
      var list = [].slice.call(document.querySelectorAll('pre code'))
      list.forEach((val, index) => {
        hljs.highlightBlock(val)
      })
    },
    computed: {

    }
  }
</script>

<style>
  .content {
    margin: auto;
    max-width: 1200px;
    margin-bottom: 100px;
  }
  
  .test-button {
    display: flex;
    flex-wrap: wrap;
  }
  
  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 20px 10px 0px 0px;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all .2s ease;
    text-decoration: none;
    user-select: none;
  }
  
  .des {
    line-height: 30px;
  }
  
  code.language-html {
    padding: 10px 20px;
    margin: 10px 0px;
    display: block;
    background-color: #333;
    color: #fff;
    overflow-x: auto;
    font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo, Lucida, Sans, Type, Writer, Ubuntu, Mono;
    border-radius: 5px;
    white-space: pre;
  }
  
  .show-info {
    margin-bottom: 50px;
  }
  
  .show-info h2 {
    line-height: 50px;
  }
  
  .title {
    display: block;
    text-decoration: none;
    text-align: center;
    line-height: 1.5;
    margin: 20px 0px;
    background-image: -webkit-linear-gradient(left, #3498db, #f47920 10%, #d71345 20%, #f7acbc 30%, #ffd400 40%, #3498db 50%, #f47920 60%, #d71345 70%, #f7acbc 80%, #ffd400 90%, #3498db);
    color: transparent;
    -webkit-background-clip: text;
    background-size: 200% 100%;
    animation: slide 5s infinite linear;
    font-size: 40px;
  }
  
  .test {
    height: 500px;
  }
  
  @import '../../assets/scss/components/preview.scss';
  
  .c-item {
    display: block;
    padding: 10px 0;
    user-select: none;
  }
  
  @keyframes slide {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
</style>
