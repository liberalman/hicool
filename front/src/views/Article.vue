<template lang="html">
  <div class="" v-loading.fullscreen.lock="loading">
    <header class="a-header" :style="{background: 'url('+ (article.cover ? article.cover : 'http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg') +')' + 'center center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
      <div class="text-wrap">
        <h3 class="shadow">{{article.title}}</h3>
        </br>
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
      <div class="content" v-if="article.editor == 1">
        <markdown-it-vue :content="article.content" :options="options"/>
      </div>
      <div class="content" v-html="article.content" v-else></div>
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
  //import 'highlight.js/styles/github.css'

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
      'markdown-it-vue': () =>
        import('./components/Markdown'),
    },
    metaInfo() {
      return {
          //改变当前路由的title
          title: this.article.title + ' -【Hicool】',
          meta: [
            {
              name: 'keywords',
              content: this.serializeTags()
            },
            {
              name: 'description',
              content: this.article.description
            }
          ],
      }
    },
    data() {
      return {
        isMounted: false,
        options: {
          markdownIt: {
            linkify: true
          },
          linkAttributes: {
            target: '_blank',
            rel: 'noopener'
          },
          katex: {
            throwOnError: false,
            errorColor: '#cc0000'
          },
          icons: 'font-awesome',
          githubToc: {
            tocFirstLevel: 2,
            tocLastLevel: 3,
            tocClassName: 'toc',
            anchorLinkSymbol: '',
            anchorLinkSpace: false,
            anchorClassName: 'anchor',
            anchorLinkSymbolClassName: 'octicon octicon-link'
          }
        },
      }
    },
    computed: Vuex.mapState({
      article: state => state.article,
      loading: state => state.article.loading,
      isMine() {
        return this.utils.isMine(this.article)
      },
    }),
    mounted () {
      this.fetchData()
    },
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
          router.push({ params: { id: this.$route.params.id}, name: 'editarticle'})
        } else {
          router.push({ params: { id: this.$route.params.id}, name: 'editarticle1'})
        }
      },
      serializeTags() {
        let str = ''
        for (let i = 0; i < this.article.tags.length; i++) {
          str += this.article.tags[i].name + ','
        }
        return str
      },
      likeArticle() {
        let _this = this
        this.$store.dispatch(`article/toggleLikeArticle`, this.$route.params.id)
        .then(function(response) {
          _this.$message({
            message: '操作成功!',
            type: 'success'
          })
          router.go(0)
        })
        .catch(error => { // 这里的error返回的是个string类型
          _this.$message({
            message: error,
            type: 'error'
          });
        })
      },
    },
    watch: {
      '$route'(to, from) {
        this.fetchData()
      },
    },
  }
</script>

<style lang="scss">
  @import '../assets/scss/article.scss';
  @import '../assets/scss/components/header.scss';
</style>
