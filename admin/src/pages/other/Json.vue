<template>
  <div id="main">
      <vue-json-editor
        :mode="'code'"
        v-model="model"
        :showBtns="true"
        @json-change="onJsonChange"></vue-json-editor>
  </div>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'

export default {
  name: "Json",
  components: {
    vueJsonEditor
  },
  data() {
    return {
      model: {
        name: 'Yourtion',
      },
    }
  },
  methods: {
    onJsonChange (value) {
       console.log('value:', value)
    }
  },
  mounted() {
  }
};
</script>

<style lang="less">
#main {
  color: #eee;
  width: 1000px;
  margin: 50px auto;
}
</style>
