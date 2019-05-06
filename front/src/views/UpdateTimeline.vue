<template lang="html">
  <EditTimeline :timeline="timeline"></EditTimeline>
</template>

<script>
  export default {
    components: {
      'EditTimeline': () => import('./components/EditTimeline.vue')
    },
    computed: Vuex.mapState({
      timeline: state => state.timeline
    }),
    mounted() {
      this.$store.dispatch('timeline/getTimeline', { id: this.$route.params.id, isAuthed: true})
    },
  }
</script>
