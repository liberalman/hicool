<template>
  <div class="list-wrapper">
    <transition name="fade">
      <ul class="list-container" v-if="show">
        <li v-for="item in tagContents" :key="item._id">
          <router-link :to="{ name: 'article', params: {id: item._id} }">
            <p class="list-title" v-text="item.title"></p>
            <p class="list-updated">
              作者：{{item.author_id.nickname}} 发布：{{item.updated | handleDateFormat}}
            </p>
            <p class="list-abstract" v-text="item.description"></p>
          </router-link>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: true
      }
    },
    computed: Vuex.mapState({
      tagContents: state => state.articles.list,
      tags: state => state.tags.list
    }),
    watch: {
      'tagContents': function(val, oldVal) {
        this.show = false
        setTimeout(() => {
          this.show = true
        }, 400)
      },
      'tags': function(val, oldVal) {
        if(val) {
          this.$store.dispatch('articles/getArticles', {
            tagId: val[0]._id,
            current_page: 1,
            page_size: 10
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/components/tagContentList.scss';
</style>