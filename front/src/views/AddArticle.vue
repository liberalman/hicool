<template lang="html">
  <Edit/>
</template>

<script>
  export default {
    components: {
      'Edit': () => import('./components/Edit.vue')
    },
  }
</script>