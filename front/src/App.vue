<template>
  <div id="app">
    <transition name="fade">
      <router-view class="router-view" v-if="isRouterAlive"></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'app',
    provide () {
      return {
        reload: this.reload
      }
    },
    data () {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style>
@import './assets/scss/app.scss';
</style>
