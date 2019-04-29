<template lang="html">
  <div class="" v-loading.fullscreen.lock="loading">
    <header class="a-header" :style="{background: 'url('+ (timeline.cover ? timeline.cover : 'http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg') +')' + 'center center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
      <div class="text-wrap">
        <h2 class="shaddow">{{timeline.title}}</h2>
        <p class="shadow-light">{{timeline.description}}</p>
      </div>
    </header>
    <div class="article-wrapper" style="margin: 2em auto;">
      <div class="create">
        {{timeline.publish_time | handleDateFormat}}
        <el-button :disabled="!isMine" @click="editArticle()" type="text"><i class="el-icon-edit"></i></el-button>
        <el-button :disabled="!isMine" @click="deleteArticle()" type="text"><i class="el-icon-delete"></i></el-button>
      </div>
      <div class="content">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in timeline.points"
          :key="_id"
          :timestamp="activity.publish_time">
          {{activity.description}}
        </el-timeline-item>
      </el-timeline>
      <el-divider></el-divider>
      </div>
    </div>
    <CopyRight />
  </div>
</template>

<script>
  import router from '../router'

  export default {
    props: ['headline', 'subline', 'mySrc'],
    components: {
      'Comment': () =>
        import('./components/Comment.vue'),
      'CopyRight': () =>
        import('./components/CopyRight.vue'),
      'vNav': () =>
        import('./components/Nav.vue'),
    },
    data(){
      return {
        isMounted: false
      }
    },
    computed: Vuex.mapState({
      timeline: state => state.timeline,
      loading: state => state.timeline.loading,
      isMine() {
        return this.utils.isMine(this.timeline)
      },
    }),
    mounted () {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.$store.dispatch('timeline/getTimeline', { id: this.$route.params.id, isAuthed: this.utils.isLogin() })
      },
      deleteTimeline() {
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.$store.dispatch('timeline/delete', this.$route.params.id)
            .then(function(response) {
                _this.$message({
                  message: '操作成功!',
                  type: 'success'
                })
                router.push('/')
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
      editTimeline() {
        router.push('/post/edit/' + this.$route.params.id)
      },
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/article.scss';
  @import '../assets/scss/components/header.scss';
</style>
