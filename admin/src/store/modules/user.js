import * as types from '../mutation-types'
import api from '../../utils/api'

export default {
  namespaced: true,
  state: { // 不是所有变量都要放到 state 中，vuex 创立的初衷是方便我们对变量的管理，然而对组件的一些私有变量，不需要和别的组件共享。所以，state里面只放全局变量、多组件共享变量。
    token: '',
    nickname: '',
    email: '',
    description: '',
    notifyCount: 0,
    avatar: '',
    birthday: '',
    updated: '',
    created: '',
    status: 0,
    role: '',
    likeList: [],
    provider: '',
    _id: ''
  },
  mutations: { // 存放同步读取、修改state的的方法
    [types.LOGIN] (state, data) {
      /*
       * response example:
       * {
       *   "type": "account",
       *   "currentAuthority": "admin",
       *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTRjYTljMDYyM2JmNTFiNWUzMjZmNWYiLCJpYXQiOjE1NDQ1ODI1MzAsImV4cCI6MTU3NjExDOzUMH0.q33q_qHuzoidvMM1v0dDQnbAv9eHMb5kzXCIUyaSxws"
           "nickname": "admin",
       *   "role": "admin",
       *   "email": "admin@admin.com",
       *   "description": "I'm the best!",
       *   "birthday": "2018-01-03T10:00:32.873Z",
       *   "avatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
       *   "likes": ["5a4da6f87075893882e87e01", "5a7b2ddbd9d64e469482cf4b", "5a7b24349b46b82c80cf2f3b"],
       *   "provider": "local",
       *   "notifyCount": 12
       * }
      */
      state.token = data.token
      state.nickname = data.nickname
      state.email = data.email
      state.description = data.description
      state.notifyCount = data.notifyCount
      state.avatar = data.avatar
    },
    [types.GET_ME] (state, data) {
      state.nickname = data.nickname
      state.email = data.email
      state.description = data.description
      state.notifyCount = data.notifyCount
      state.avatar = data.avatar
    },
    [types.GET_USER] (state, data) {
      state._id = data._id
      state.nickname = data.nickname
      state.email = data.email
      state.description = data.description
      state.avatar = data.avatar
      state.birthday = data.birthday
      state.updated = data.updated
      state.created = data.created
      state.likeList = data.likeList
      state.status = data.status
      state.role = data.role
    }
  },
  actions: { // 存放异步读取、修改state的的方法。解释一下 action ，所谓异步，就是在 action 文件中写方法，调 axios，然后再 调 mutations 同步修改state。很多人不理解，其实，这就是一个概念性的问题。action并没有从根本上解决异步修改state的竞争问题，但是我们需要理解、并将 异步这个操作 摘出来放在一起。
    login ({ commit }, { email, password, captcha }) {
      return api.login(email, password, captcha)
    },
    getMe ({commit}) {
      api.getMe()
        .then(res => {
          commit(types.GET_ME, res)
        })
    },
    getUser ({ commit }, id) {
      api.getUser(id)
        .then(res => {
          commit(types.GET_USER, res)
        })
    },
    deleteUser ({ commit }, id) {
      return api.deleteUser(id) // 直接返回一个promise，调用端去处理业务逻辑
    },
    updateUser ({ commit }, user) {
      return api.updateUser(user)
    }
  }
}
