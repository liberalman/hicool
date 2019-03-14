<template>
  <div>
    <header>
      <vNav></vNav>
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in albums" :key="item">
          <div style="text-align: center">
            <img v-bind:src="item.cover" class="img-responsive" alt="响应式图像" />
          </div>
          <div class="text-wrap">
            <h1 class="shaddow">{{item.title}}</h1>
            <p class="shadow-light">{{item.content}}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </header>
    <br />
    <div style="height: 100em;">
      <vue-waterfall-easy :imgsArr="imgsArr" @scrollReachBottom="fetchData" @click="clickFn">
        <div slot-scope="props">
          <el-card :body-style="{ padding: '0px' }">
            <div style="padding: 14px;">
              <h1>{{props.value.title}}</h1>
              <span>{{props.value.content}}</span>
              <div class="bottom clearfix">
                <time class="time">{{ props.value.publish_time | handleDateFormat }}</time>
              </div>
            </div>
          </el-card>
        </div>
      </vue-waterfall-easy>
    </div>
    <!--
    <el-row>
      <el-col :span="8" v-for="(item, index) in albums" :key="item" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }">
          <img v-bind:src="item.cover" class="image">
          <div style="padding: 14px;">
            <h2>{{item.title}}</h2>
            <span>{{item.content}}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item.publish_time | handleDateFormat }}</time>
              <el-button type="text" class="button">》</el-button>
            </div>
          </div>
        </el-card>
        <br />
      </el-col>
    </el-row>
-->
    <el-pagination style="text-align: center;" @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page" :page-sizes="[10, 20, 30, 40]"
      :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <CopyRight />
  </div>
</template>

<script>
import vueWaterfallEasy from 'vue-waterfall-easy'

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
      fetchImgsArr: [], //存放每次滚动时下一批要加载的图片的数组

      page: 1, // request param
      size: 10,
      sortName: ''
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: Vuex.mapState({
    albums: state => state.albums.list,
    imgsArr: state => { //存放所有已加载图片的数组（即当前页面会加载的所有图片），预加载完之后再才开始
      let list = []
      state.albums.list.forEach(function(item, index) {
        list.push({
          "src": item.cover,
          "href": '/#/album/' + item._id,
          "title": item.title,
          "content": item.content,
          "publish_time": item.publish_time
        })
      })
      return list
    },
    total: state => state.albums.total
  }),
  methods: {
    fetchData() {
      this.$store.dispatch('albums/getAlbums', {
        page: this.page,
        size: this.size,
        sortName: this.sortName
      })
    },
    fetchImgsData() { //获取新的图片数据的方法，用于页面滚动满足条件时调用
      this.imgsArr = this.imgsArr.concat(this.fetchImgsArr) //数组拼接，把下一批要加载的图片放入所有图片的数组中
    },
    clickFn(event, {
      index,
      value
    }) {
      window.location.href = "/#/album/" + value._id
      /*
      // 阻止a标签跳转
      event.preventDefault()
      // 只有当点击到图片时才进行操作
      if(event.target.tagName.toLowerCase() == 'img') {
        console.log('img clicked', index, value)
      }*/
    },
    handleSizeChange(val) {
      this.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.page = val
      this.fetchData()
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/scss/album.scss';
  @import '../assets/scss/components/header.scss';
</style>