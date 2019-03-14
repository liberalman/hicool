// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import * as filters from './utils/filter'

import ElementUI from 'element-ui'   // 完整引入
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 使用时间格式化插件moment()
Vue.use(require('vue-moment'))

// 搜索框
import 'vue-instant/dist/vue-instant.css'
import VueInstant from 'vue-instant/dist/vue-instant.common'
Vue.use(VueInstant)

// 公共方法
import Utils from './utils/utils.js'
Vue.prototype.utils = Utils

import fastClick from 'fastclick'
fastClick.attach(document.body) // 消除移动端双击延时

// 遍历载入Vue的filter (过滤器)
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})