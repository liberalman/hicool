<template>
  <div class="pagination">
    <div v-show="!isFirst" @click="lastPage()" class="new-post">
      <span>←</span> Newer Post
    </div>
    <span class="page-number">
      Page {{curPage}} of {{allPage}}
    </span>
    <div v-show="isEnd" @click="nextPage()" class="older-post">
      Older Post <span>→</span>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        page: 1,
        pageSize: 10,
        isFirst: true,
        isEnd: true
      }
    },
    created() {

    },
    computed: {
      curPage() {
        return this.$store.state.articles.curPage
      },
      allPage() {
        let allContentListLength = this.$store.state.articles.total
        return Math.ceil(allContentListLength / 10)
      }
    },
    watch: {
      curPage(value) {
        if(value > 1 && value < this.allPage) {
          this.isFirst = false
        } else if(value === this.allPage) {
          this.isEnd = false
          this.isFirst = false
        } else {
          this.isFirst = true
          this.isEnd = true
        }
      },
    },
    methods: {
      nextPage() {
        window.scrollTo(0, 0)
        this.$store.dispatch('getContentByPage', {
          page: ++this.page,
          pageSize: this.pageSize
        })
      },
      lastPage() {
        window.scrollTo(0, 0)
        this.$store.dispatch('getContentByPage', {
          page: --this.page,
          pageSize: this.pageSize
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/components/footer.scss';
</style>