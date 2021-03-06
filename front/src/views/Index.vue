<template lang="html">
  <div>
    <vHeader :headline="headline" :subline="subline" :mySrc="imgSrc" />

    <ul class="main-wrapper" id="content">
      <li v-for="item in list" :key="item._id" class="main-item">
        <router-link :to="{name: 'article', params: {id: item._id}}" target="_blank" class="item">
          <section class="list-title" v-text="item.title"></section>
        </router-link>

        <section class="list-abstract">
          <div v-if="item.images[0]">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="2" style="text-align:center">
                <el-carousel :interval="4000" height="8em" indicator-position="none">
                  <el-carousel-item v-for="images in item.images" :key="images.url">
                    <img v-bind:src="images.url" class="img-responsive" alt="photo" />
                  </el-carousel-item>
                </el-carousel>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="22">
              <div v-if="item.description">
                {{item.description}}
                <router-link :to="{name: 'article', params: {id: item._id}}">»</router-link>
              </div>
            </el-col>
          </el-row>
          </div>
          <div v-else>
            <div v-if="item.description">
              {{item.description}}
              <router-link :to="{name: 'article', params: {id: item._id}}">»</router-link>
            </div>
          </div> 
        </section>

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

    <vFooter />
  </div>
</template>

<script>
  import Avatar from 'vue-avatar'

  export default {
    components: {
      'vHeader': () =>
        import('./components/Header.vue'),
      'vFooter': () =>
        import('./components/Footer.vue'),
      'avatar': Avatar
    },
    data() {
      return {
        page: 1,
        size: 10,
        tagId: '',
        headline: 'HICOOL'
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
      total: state => state.articles.total,
      imgSrc: state => state.tip.cover,
      subline: state => state.tip.content
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
        this.$store.dispatch('tip/getTipIndex')
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
</style>
