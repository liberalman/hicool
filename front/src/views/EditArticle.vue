<template lang="html">
  <Edit :article="article"></Edit>
</template>

<script>
  export default {
    components: {
      'Edit': () => import('./components/Edit.vue')
    },
    computed: Vuex.mapState({
      article: state => state.article
    }),
    mounted() {
      this.$store.dispatch('article/getArticle', { id: this.$route.params.id, isAuthed: true})
    },
  }
</script>