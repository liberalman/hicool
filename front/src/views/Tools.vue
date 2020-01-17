<template>
  <div>
    <header :style="{'min-height': '5em',background: 'url(http://image.hicool.top/static/album/5ac0a43f7c0636267ed49b91/1503658700339782278.jpg) center / cover', backgroundSize: 'cover'}">
      <vNav></vNav>
    </header>

    <div id="main">
      <vue-json-editor
        :mode="'code'"
        v-model="model"
        :showBtns="true"
        @json-change="onJsonChange"></vue-json-editor>
    </div>

    <CopyRight />
  </div>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
export default {
  name: "Tools",
  components: {
    'vNav': () => import('./components/Nav'),
    'CopyRight': () => import('./components/CopyRight.vue'),
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

<style lang="scss">
  @import '../assets/scss/components/header.scss';
</style>
