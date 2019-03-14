<template lang="html">
  <div class="" v-loading.fullscreen.lock="loading">
    <header class="a-header" :style="{background: 'url('+ (article.cover ? article.cover : 'http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg') +')' + 'center center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
      <div class="text-wrap">
        <h1 class="shaddow">{{article.title}}</h1>
        <p class="shadow-light">{{article.description}}</p>
      </div>
    </header>
    <div class="article-wrapper" style="margin: 2em auto;">
      <TinymceEditor
        class="editor"
        :value="article.content"
        :setting="editorSetting"
        @show="editors"
        :url              = "Url"
        :max-size         = "MaxSize"
        :accept           = "Accept"
        :with-credentials = "withCredentials"
        @on-upload-fail   = "onEditorReady"
        @on-upload-success= "onEditorUploadComplete"
        :article="article"/>
    </div>
    <CopyRight />
  </div>
</template>

<script>
import TinymceEditor from './components/Tinymce' // 根据editor.vue组件位置引入
export default {
  data() {
    return {
      editorSetting: { // 配置富文本编辑器高
        height: 900
      },
      Url: 'http://localhost:9528/api/PublicTransaction-SYS-Web/upload/singleUpload', // 图片对应的上传地址
      MaxSize: 75765, // 文件大小
      Accept: 'image/jpeg, image/png, image/gif, image/webp', // 文件格式
      withCredentials: true,
    }
  },
  components: { // 引入组件
    TinymceEditor,
    'vNav': () =>
        import('./components/Nav.vue'),
    'CopyRight': () =>
        import('./components/CopyRight.vue'),
  },
  computed: Vuex.mapState({
    article: state => state.article
  }),
  mounted() {
      this.fetchData()
  },
  methods: {
    fetchData () {
      this.$store.dispatch('article/getArticle', { id: this.$route.params.id, isAuthed: true })
    },
    editors(content) { // editor组件传过来的值赋给content
      // console.log(content)
      this.article.content = content
    },
    onEditorReady(ins, ina) { // 上传失败的函数
      console.log('ins')
      console.log(ins)
      console.log(ina)
    },
    onEditorUploadComplete(json) { // 处理上传图片后返回数据，添加img标签到编辑框内
      console.log('json')
      console.log(json)
      console.log(json[0].data.filePath)
      this.content = this.article.content + '<img src=' + json[0].data.filePath + '>'
    }
  }
}
</script>

<style lang="scss">
  @import '../assets/scss/article.scss';
  @import '../assets/scss/components/header.scss';
</style>