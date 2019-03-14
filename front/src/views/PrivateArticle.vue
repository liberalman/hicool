<template lang="html">
  <Articles :type="2"></Articles>
</template>

<script>
  export default {
    components: {
      'Articles': () => import('./components/Articles.vue')
    },
  }
</script>