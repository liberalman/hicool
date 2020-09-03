<template lang="html">
  <div>
    <js-mind :values="article.mind" :options="options" ref="jsMind" height="200em"></js-mind>
    <span>
      <el-button type="primary" @click="submitForm">Save</el-button>
    </span>
  </div>
</template>

<script>
  import router from '../router'
  // https://github.com/hizzgdev/jsmind
  import jm from 'vue-jsmind'

  export default {
    components: {
      'js-mind': jm,
    },
    data() {
      return {
        options: {
            container:'jsmind_container', // [必选] 容器的ID
            editable:true,                // [可选] 是否启用编辑
            theme:'orange'                // [可选] 主题
        }
      }
    },
    computed: Vuex.mapState({
      article: state => {
        state.article.mind = JSON.parse(state.article.content)
        return state.article
      },
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
        // db.getCollection('articles').find({_id: ObjectId("5e9ec647d74e37c7419656b1")})
        this.$store.dispatch('article/getArticle', { id: this.$route.params.id, isAuthed: this.utils.isLogin() })
      },
      submitForm() {
        const data = {
          "title": this.article.title,
          "content": JSON.stringify(this.article.mind),
          "cover": this.article.cover,
          "description": this.article.description,
          "top": this.article.top,
          "type": this.article.type,
          "editor": this.article.editor,
          "status": this.article.status,
          "isRePub": this.article.isRePub,
          "tags": this.article.tags,
          "reprint_url": this.article.reprint_url,
        }
        console.log(data)
        let ret = {}
        //let id = "5e9ec647d74e37c7419656b1"
        let id = this.article._id
        if('' != id) {
          ret = this.$store.dispatch('article/update', { id: id, data: data})
        } else {
          ret = this.$store.dispatch('article/create', data)
        }
        let _this = this
        ret.then(function(response) {
            _this.$message({
              message: '发布成功!',
              type: 'success'
            })
            if(id !== '') {
              router.push('/mind/' + id)
            } else {
              router.push('/')
            }
          })
          .catch(error => { // 这里的error返回的是个string类型
            _this.$message({
              message: error,
              type: 'error'
            });
          })
      }
    },
    watch: {
      '$route'(to, from) {
        this.fetchData()
      }
    }
  }
</script>
