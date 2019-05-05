<template lang="html">
  <div>
    <vHeader :headline="headline" :subline="subline" :mySrc="imgSrc" />

    <ul class="main-wrapper" id="content">
      <li v-for="item in list" :key="item._id" class="main-item">
        <router-link :to="{name: 'timeline', params: {id: item._id}}" target="_blank" class="item">
          <section class="list-title" v-text="item.title"></section>
        </router-link>

        <section class="list-abstract">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="2" style="text-align:center">
              <el-image :src="item.cover" :fit="contain" lazy>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="22">
              <div v-if="item.description">
                {{item.description}}
                <router-link :to="{name: 'timeline', params: {id: item._id}}">»</router-link>
              </div>
            </el-col>
          </el-row>
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
        headline: 'TIMELINE', // 用户名
        subline: 'The thought of independence and freedom.', // 副标题
        imgSrc: 'http://image.hicool.top/static/album/5ac0a4bac0979028323030f3/1503759063328965200.jpg' // 头图 http://of30nsqpd.bkt.clouddn.com/2015061101335924.jpeg
      }
    },
    computed: Vuex.mapState({
      list: state => state.timelines.list,
      total: state => state.timelines.total
    }),
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.$store.dispatch('timelines/getMyTimelines', {
          page: this.page,
          size: this.size,
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
