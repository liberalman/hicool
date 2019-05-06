<template lang="html">
  <EditTimeline/>
</template>

<script>
  export default {
    components: {
      'EditTimeline': () => import('./components/EditTimeline.vue')
    },
  }
</script>
