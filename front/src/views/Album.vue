<template>
  <div>
    <header>
      <vNav></vNav>
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in album.images.slice(0, 5)" :key="item">
          <div style="text-align: center">
            <img v-bind:src="item.url" class="img-responsive" alt="响应式图像" />
          </div>
          <div class="text-wrap">
            <h1 class="shaddow">{{item.publish_time | handleDateFormat}}</h1>
            <p class="shadow-light">{{item.description}}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </header>
    <div style="text-align: center;padding: 0 14px;">
      <el-collapse>
        <el-collapse-item title="+添加图片">
          <el-upload :auto-upload="false"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            ref="upload"
            list-type="picture-card"
            action="uploadUrl()">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <br />
          <el-button size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div style="height: 300em;">
      <vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="fetchData" @click="clickFn">
        <div slot-scope="props">
          <el-card :body-style="{ padding: '0px' }">
            <div style="padding: 14px;">
              <span>{{props.value.description}}</span>
              <div class="bottom clearfix">
                <time class="time">{{ props.value.publish_time | handleDateFormat }}</time>
                <br />
                <br />
                <el-button-group class="button">
                  <el-button size="mini" icon="el-icon-edit"></el-button>
                  <el-button size="mini" icon="el-icon-share"></el-button>
                  <el-button size="mini" icon="el-icon-delete" @click="deletePhoto(props.value._id)"></el-button>
                </el-button-group>
              </div>
            </div>
          </el-card>
        </div>
      </vue-waterfall-easy>
    </div>

    <div class="model" v-show="model" @click="model = false">
      <div class="model-show">
        <img :src="modelSrc" alt="">
      </div>
    </div>
    
    <el-pagination style="text-align: center;" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]"
      :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <CopyRight />
  </div>
</template>

<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import CanvasCompress from 'canvas-compress'
import { QINIU_UPLOAD_ADDR, QINIU_IMG_ADDR } from '../config'

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

export default {
  props: {
    gap: { // 图片间隔
      type: Number,
      default: 20
    },
    maxCols: { // 最大的列数
      type: Number,
      default: 5
    },
    imgsArr: { // 请求返回的图片数据，格式：[{src:'1.jpg','link':'url1' info:'自定义图片信息'},{src:'2.jpg','link':'url2',info:'自定义图片信息'}...]
      type: Array,
      required: true
    },
    imgWidth: { // 指定图片的统一宽度
      type: Number,
      default: 240
    },
    timeOut: { // 预加载事件小于500毫秒就不显示加载动画，增加用户体验
      type: Number,
      default: 500
    },
  },
  components: {
    'vNav': () =>
      import('./components/Nav'),
    'CopyRight': () =>
      import('./components/CopyRight.vue'),
    vueWaterfallEasy
  },
  data() {
    return {
      model: false,
      modelSrc: '',
      fetchImgsArr: [], //存放每次滚动时下一批要加载的图片的数组
      size: 10,
      page: 1, // request param
      dialogImageUrl: '',
      dialogVisible: false,
      imageUrl: '',
    }
  },
  computed: Vuex.mapState({
    album: state => state.album,
    imgsArr: state => { //存放所有已加载图片的数组（即当前页面会加载的所有图片），预加载完之后再才开始
      let list = []
      state.album.images.forEach(function(item, index) {
        list.push({
          "src": item.url,
          "description": item.description,
          "publish_time": item.publish_time
        })
      })
      return list
    },
    total: state => state.album.photonum
  }),
  created () {
    this.$store.dispatch('third/getQiniuToken')
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$store.dispatch('album/getAlbum', this.$route.params.id)
    },
    fetchImgsData() { //获取新的图片数据的方法，用于页面滚动满足条件时调用
      this.imgsArr = this.imgsArr.concat(this.fetchImgsArr) //数组拼接，把下一批要加载的图片放入所有图片的数组中
    },
    clickFn(event, { index, value }) {
      // 阻止a标签跳转
      event.preventDefault()
      // 只有当点击到图片时才进行操作
      if(event.target.tagName.toLowerCase() == 'img') {
        this.model = true
        this.modelSrc = value.src
      }
    },
    handleRemove(file, fileList) {
      //console.log(file);
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file) { //上传成功后在图片框显示图片。根据你七牛云上绑定的域名 拼接了这个key 就是你上传文件的地址了，'http://你的域名地址.com/'+ res.key
      console.log(res)
      this.imageUrl = 'https://image.hicool.top/' + res.key
    },
    handleError(res) { //显示错误
      console.log(res)
    },
    // 验证文件合法性
    async beforeUpload(file) { // 默认是立即上传图片，而我们的需求是点击确定按钮之后再上传多张图片。在图片提交前进行验证
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const fz = file.size / 1024 / 1024
      const isLt2M = fz < 2

      if(!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
        return false
      }
      if(!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
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

      let _this = this
      // 压缩
      let blob = await compress(file)
      //compress(file).then((blob) => {
        // https://serversideup.net/uploading-files-vuejs-axios/
        // 重命名要上传的文件
        /*let curr = Vue.moment().format('YYYYMMDD').toString()
        let prefix = Vue.moment(file.lastModified).format('HHmmss').toString()
        let suffix = file.name
        let keyname = encodeURI(`/hicool/${curr}/${prefix}_${suffix}`)*/
        const keyname = 'hicool/gallery/' + _this.$route.params.id + '/' + new Date().getTime() + Math.floor(Math.random() * 100) + '.' + filetype
        // 从后端获取上传凭证token
        let formdata = new FormData()
        formdata.append('file', blob)
        formdata.append('token', _this.$store.state.third.qiniuToken)
        formdata.append('key', keyname)

        // 获取到凭证之后再将文件上传到七牛云空间
        let result = await axios.post(QINIU_UPLOAD_ADDR, formdata, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        if(200 === result.status) {
          _this.imageUrl = QINIU_IMG_ADDR + '/' + result.data.key
          // console.log('img_hash:' + result.data.hash + ', img_addr:' + _this.imageUrl)
          _this.dialogImageUrl = _this.imageUrl;
          _this.dialogVisible = true;
          let res = this.$store.dispatch('album/addPhoto', { gallery_id: _this.$route.params.id,
              data: { url: _this.imageUrl, description: 'my test photo', source: 0} })
            .then(function(response) {
              _this.$message({
                message: '操作成功!',
                type: 'success'
              })
              _this.$router.push('/album/' + _this.$route.params.id)
            }).catch(error => { // 这里的error返回的是个string类型
              console.log(error)
              _this.$message({
                message: error.response.status + ' ' + error.response.data.error,
                type: 'error'
              })
            })
        } else {
          _this.$message({
            message: result.response.status + ' ' + result.response.data.error,
            type: 'error'
          })
        }
      return isJPG && isPNG && isGIF && isLt2m
    },
    uploadUrl() {
      // 心塞，幸苦一位大神耐心指点，才从坑里跳出来
      // 每个七牛云存储区域都对应着相应的服务器端客户端上传域名 https://developer.qiniu.com/kodo/manual/1671/region-endpoint
      return QINIU_UPLOAD_ADDR
    },
    submitUpload() {
      // https://segmentfault.com/a/1190000012278498 看这篇文章
      this.$refs.upload.submit();
    },
    deletePhoto(photo_id) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var _this = this;
        __this.$store.dispatch('album/deletePhoto', { gallery_id: _this.$route.params.id, photo_id: photo_id})
          .then(function(response) {
              _this.$message({
                message: '操作成功!',
                type: 'success'
              })
            })
            .catch(error => { // 这里的error返回的是个string类型
              _this.$message({
                message: error,
                type: 'error'
              });
            })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.page = val
      this.fetchData()
    },
  }
}
</script>

<style lang="scss">
  @import '../assets/scss/album.scss';
  @import '../assets/scss/components/header.scss';
  @import '../assets/scss/components/preview.scss';
</style>
