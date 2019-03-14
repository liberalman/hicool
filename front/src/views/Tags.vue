<template>
  <div>
    <vNav></vNav>
    <header class="a-header">
      <nav class="main-nav">
        <h1>{{headerName}}</h1>
      </nav>
    </header>
    <div class="tag-list">
      <ul>
        <li v-for="(tag, index) in tags" :key="tag._id">
          <a @click="update(index, tag.name, tag._id)" :class="{'tag-list-active' : index === selected}">
            {{tag.name}}
          </a>
        </li>
      </ul>
    </div>
    <tag-content-list></tag-content-list>
    <el-pagination style="text-align: center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <CopyRight />
  </div>
</template>

<script>
  import * as types from '../vuex/mutation-types'
  export default {
    components: {
      'TagContentList': () =>
        import('./components/TagContentList'),
      'vHeader': () =>
        import('./components/Header'),
      'vNav': () =>
        import('./components/Nav'),
      'CopyRight': () =>
        import('./components/CopyRight.vue')
    },
    data() {
      return {
        selected: 0,
        headerName: '',
        page: 1,
        size: 10,
        tagId: this.$store.state.tags.tagList[0]._id,
      }
    },
    created() {
      this.$store.dispatch('tags/getTags')
    },
    computed: Vuex.mapState({
      tags: state => state.tags.list,
      total: state => state.articles.total,
    }),
    watch: {
      'tags': function(val) {
        if(val) {
          this.headerName = val[0].name
        }
      }
    },
    methods: {
      update(index, tagName, tagId) {
        this.tagId = tagId
        this.selected = index
        this.headerName = tagName
        this.onSubmit()
      },
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
        this.size = val
        this.onSubmit()
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.page = val
        this.onSubmit()
      },
      onSubmit() {
        this.$store.dispatch('articles/getArticles', {
          tagId: this.tagId,
          page: this.page,
          size: this.size
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/tags.scss';
</style>