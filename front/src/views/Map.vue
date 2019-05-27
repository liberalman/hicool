<template lang="html">
  <div>
    <vNav></vNav>
    <div class="article-wrapper" style="margin:4em auto;"> 
      <baidu-map class="map" ak="YOUR_APP_KEY" center="天安门"></baidu-map>
    </div>
    <vCopyRight />
  </div>
</template>

<script>
  import { BaiduMap } from 'vue-baidu-map'

  export default {
    components: {
      'vHeader': () =>
        import('./components/Header.vue'),
      'vCopyRight': () =>
        import('./components/CopyRight.vue'),
      BaiduMap,
    },
    data() {
      return {
      }
    },
    computed: Vuex.mapState({
    }),
    mounted() {
    },
    methods: {
    },
  }
</script>

<style lang="scss">
  @import '../assets/scss/components/header.scss';
</style>

<style>
/* 地图容器必须设置宽和高属性 */
.map {
  width: 100%;
  height: 50em;
}
</style>
