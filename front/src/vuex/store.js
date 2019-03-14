import createLogger from 'vuex/dist/logger'
import actions from './actions'
import createPersistedState from "vuex-persistedstate" // 通过localStorage来存储store信息，以达到跨页面刷新数据还在的效果。

// modules 模块分类
import articles from './modules/articles'
import article from './modules/article'
import comments from './modules/comments'
import tags from './modules/tags'
import user from './modules/user'
import third from './modules/third'
import albums from './modules/albums'
import album from './modules/album'
import privateArticles from './modules/privateArticles'
import likeArticles from './modules/likeArticles'

Vue.use(Vuex)
Vue.config.debug = true
// 非生产环境下开启严格模式，用以检测是否有在 mutation 外改变 store
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  actions,
  modules: {
    articles,
    article,
    comments,
    tags,
    user,
    third,
    albums,
    album,
    privateArticles,
    likeArticles
  },
  plugins: process.env.NODE_ENV !== 'production' ? [
    createPersistedState(),
    createLogger()
  ] : [createPersistedState()]
})