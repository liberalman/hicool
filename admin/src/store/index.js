import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import setting from './modules/setting'
import article from './modules/article'
import articles from './modules/articles'
import tip from './modules/tip'
import tips from './modules/tips'
import tags from './modules/tags'
import albums from './modules/albums'
import album from './modules/album'
import user from './modules/user'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    users,
    account,
    setting,
    articles,
    tags,
    article,
    albums,
    album,
    tips,
    tip,
  }
})
