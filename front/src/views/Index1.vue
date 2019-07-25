<template lang="html">
  <div>
   <header>
     <vNav></vNav>
   </header> 
    <ul class="main-wrapper" id="content">
      <li v-for="item in list" :key="item._id" class="main-item">
        <router-link :to="{name: 'article', params: {id: item._id}}" target="_blank" class="item">
          <section class="list-title" v-text="item.title"></section>
        </router-link>

        <section class="list-info">
          <section class="list-author">
            <el-tooltip class="item" effect="dark" :content="item.author_id.nickname" placement="top-start">
              <avatar :username="item.author_id.nickname" :src="item.author_id.avatar" :size="20"></avatar>
            </el-tooltip>
          </section>
          <section class="list-author" v-text="item.author_id.nickname"></section>
          <section class="list-created">{{item.publish_time | handleDateFormat}}</section>
          <section class="list-created"><i class="el-icon-view"></i> {{item.visit_count}}</section>
          <section class="list-created"><i class="el-icon-star-off"></i> {{item.like_count}}</section>
          <section class="list-created" v-if="item.tags[0]">{{item.tags[0].name}}</section>
        </section>
      </li>
    </ul>

    <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <div class="pointer-wrap" @click="scrollDown()">
      <i class="el-icon-arrow-down"></i>
    </div>

    <vFooter />
  </div>
</template>

<script>
  import Avatar from 'vue-avatar'

  export default {
    components: {
      'vNav': () =>
        import('./components/Nav.vue'),
      'vFooter': () =>
        import('./components/Footer.vue'),
      'avatar': Avatar
    },
    data() {
      return {
        page: 1,
        size: 10,
        tagId: '',
        headline: 'HICOOL', // 用户名
        subline: 'The thought of independence and freedom.', // 副标题
        imgSrc: 'http://image.hicool.top/static/album/5ac0a4bac0979028323030f3/1503763878609383500.jpg' // 头图 http://of30nsqpd.bkt.clouddn.com/2015061101335924.jpeg
      }
    },
    computed: Vuex.mapState({
      list: state => {
        for(let i = 0; i < state.articles.list.length; i++) {
          if(state.articles.list[i].images && state.articles.list[i].images.length > 5) {
            state.articles.list[i].images.splice(5, state.articles.list[i].images.length - 5)
          }
        }
        return state.articles.list
      },
      total: state => state.articles.total
    }),
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.$store.dispatch('articles/getArticles', {
          page: this.page,
          size: this.size,
          tagId: this.tagId
        })
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
      scrollDown() {
        window.scrollTo(0, 800);
      }
    },
  }
</script>

<style lang="scss">
  @import '../assets/scss/index.scss';
</style>

<style>
  .item {
    margin: 4px;
  }
  @import '../assets/scss/components/header.scss';
</style>
