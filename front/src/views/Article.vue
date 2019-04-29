<template lang="html">
  <div class="" v-loading.fullscreen.lock="loading">
    <header class="a-header" :style="{background: 'url('+ (article.cover ? article.cover : 'http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg') +')' + 'center center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
      <div class="text-wrap">
        <h2 class="shaddow">{{article.title}}</h2>
        <p class="shadow-light">{{article.description}}</p>
      </div>
    </header>
    <div class="article-wrapper" style="margin: 2em auto;">
      <div class="create">
        <el-button type="text"><avatar :username="article.author_id.nickname" :src="article.author_id.avatar" :size="25"></avatar></el-button>
        {{article.createdAt | handleDateFormat}}
        <el-button :disabled="!isMine" @click="editArticle()" type="text"><i class="el-icon-edit"></i></el-button>
        <el-button :disabled="!isMine" @click="deleteArticle()" type="text"><i class="el-icon-delete"></i></el-button>
        <el-button :disabled="true" type="text"><i class="el-icon-view"></i> {{article.visit_count}}</el-button>
        <el-button type="text"><i class="el-icon-star-off"></i> {{article.like_count}}</el-button>
      </div>
      <span class="title" v-for="item in article.tags">
        <el-tag type="success" size="mini">{{item.name}}</el-tag>&nbsp;
      </span>
      <div class="content markdown-body" v-html="content" v-if="article.editor == 1"> </div>
      <div class="content" v-html="content" v-else></div>
      <el-divider></el-divider>
      <div class="content" style="margin-top: 1em;" v-if="article.reprint_url">
        转自: <el-link type="info" :href="article.reprint_url" target="_blank">{{article.reprint_url}}</el-link>
      </div>
      <el-row>
        <el-button round @click="likeArticle()" v-if="!article.is_like">喜欢</el-button>
        <el-button round @click="likeArticle()" type="danger" v-if="article.is_like">喜欢</el-button>
      </el-row>
      <Comment></Comment>
    </div>
    <CopyRight />
  </div>
</template>

<script>
  import router from '../router'
  import Avatar from 'vue-avatar'
  import { mavonEditor } from "mavon-editor"
  import "mavon-editor/dist/css/index.css"
  import prism from 'markdown-it-prism'
  import 'prismjs/themes/prism.css'
  //import mk from 'markdown-it-katex'
  import mk from '@iktakahiro/markdown-it-katex'
  import 'katex/dist/katex.min.css'
  import 'github-markdown-css/github-markdown.css'
  var MarkdownIt = require('markdown-it')

  var md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  })

  md.use(prism)
  md.use(mk)

  export default {
    props: ['headline', 'subline', 'mySrc'],
    components: {
      'Comment': () =>
        import('./components/Comment.vue'),
      'CopyRight': () =>
        import('./components/CopyRight.vue'),
      'vNav': () =>
        import('./components/Nav.vue'),
      'avatar' : Avatar,
      mavonEditor,
    },
    data(){
      return {
        isMounted: false
      }
    },
    computed: Vuex.mapState({
      article: state => state.article,
      loading: state => state.article.loading,
      content() {
        let _content = this.$store.state.article.content
        if (this.article.editor == 1) { // 只有markdown才需要渲染
          return md.render(_content)
        }
        return _content
      },
      isMine() {
        return this.utils.isMine(this.article)
      },
    }),
    mounted () {
      this.fetchData()
    },
    /*beforeDestroy() {
      this.$store.dispatch('clearArticle')
    },*/
    methods: {
      fetchData() {
        this.$store.dispatch('article/getArticle', { id: this.$route.params.id, isAuthed: this.utils.isLogin() })
      },
      deleteArticle() {
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var _this = this;
          this.$store.dispatch('article/delete', this.$route.params.id)
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
      editArticle() {
        if (this.article.editor == 1) { // markdown编辑器
          router.push('/post/edit/' + this.$route.params.id)
        } else {
          router.push('/post/edit1/' + this.$route.params.id)
        }
      },
      likeArticle() {
        let _this = this
        axios.put(API_ROOT + 'article/' + this.$route.params.id + '/toggleLike', {}, {
          headers: {
            'Authorization': 'Bearer ' + this.getCookie('token')
          }
        })
        .then(function(response) {
            _this.$message({
              message: '操作成功!',
              type: 'success'
            });
            router.go(0)
        })
        .catch(error => {
          this.$message({
            message: error.response.status + ' ' + error.response.data.message,
            type: 'error'
          });
        })
      },
    }
  }
</script>

<style lang="scss">
  @import '../assets/scss/article.scss';
  @import '../assets/scss/components/header.scss';
</style>
