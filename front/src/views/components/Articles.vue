<template>
  <div>
    <vNav></vNav>
    <header class="a-header">
      <nav class="main-nav">
        <h1>{{headline}}</h1>
      </nav>
    </header>

    <ul class="main-wrapper" id="content">
      <li v-for="item in list" class="main-item">
        <router-link :to="{name: 'article', params: {id: item._id}}" class="item">
          <section class="list-title" v-text="item.title"></section>
        </router-link>

        <section class="list-abstract">
          {{item.description}}
          <router-link :to="{name: 'article', params: {id: item._id}}">»</router-link>
        </section>

        <section class="list-info">
          <section class="list-author" v-text="item.author_id.nickname"></section>
          <section class="list-created">{{item.publish_time | handleDateFormat}}</section>
        </section>
      </li>
    </ul>
    <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total" />
    <vCopyRight />
  </div>
</template>

<script>
export default {
  name: 'Articles', // 文章列表组件，用于 我的私密文章，我收藏的文章 等
  props: {
    type: { // 操作类型 1 我收藏的文章，2 我的私密文章
      type: Number,
      default: 1
    },
  },
  components: {
    'vCopyRight': () =>
      import('./CopyRight.vue'),
    'vNav': () =>
      import('./Nav'),
  },
  data() {
    return {
      page: 1,
      size: 10,
      type: this.$props.type,
      headline: 'HICOOL', // 用户名
      subline: 'The thought of independence and freedom.', // 副标题
      imgSrc: 'http://image.hicool.top/static/album/5ac0a4bac0979028323030f3/1503763878609383500.jpg' // 头图 http://of30nsqpd.bkt.clouddn.com/2015061101335924.jpeg
    }
  },
  computed: {
    list: {
      get: function() {
        if(2 == this.type)
          return this.$store.state.privateArticles.list
        else
          return this.$store.state.likeArticles.list
      },
      set: function(value) {
      }
    },
    total: {
      get: function() {
        if(2 == this.type)
          return this.$store.state.privateArticles.total
        else
          return this.$store.state.likeArticles.total
      },
      set: function(value) {
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  created() {
    // var self = this;
    // axios.get(API_ROOT + 'api/content/backgroundimg').then(res => {
    //   let imgURL = res.data
    //   self.imgSrc = imgURL[Math.floor(Math.random()*(imgURL.length))]
    // })
  },
  methods: {
    fetchData() {
      if(2 == this.type) {
        // 我的私密文章
        this.$store.dispatch('privateArticles/getMyArticles', { page: this.page, size: this.size, tagId: '', type: this.type })
      } else {
        // 我收藏的文章
        this.$store.dispatch('likeArticles/getLikes', { page: this.page, size: this.size })
      }
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
  @import '../../assets/scss/tags.scss';
  @import '../../assets/scss/index.scss';
</style>