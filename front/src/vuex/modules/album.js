import * as types from '../mutation-types'
import api from '../actions'

export default {
  namespaced: true,
  state: { // 不是所有变量都要放到 state 中，vuex 创立的初衷是方便我们对变量的管理，然而对组件的一些私有变量，不需要和别的组件共享。所以，state里面只放全局变量、多组件共享变量。
    _id: '',
    title: '',
    author_id: {},
    content: '',
    cover: '',
    publish_time: '',
    images: [],
    photonum: 0
  },
  mutations: { // 存放同步读取、修改state的的方法
    setTitle (state, title) {
      state.title = title
    },
    [types.GET_ALBUM] (state, data) {
      state._id = data._id
      state.title = data.title
      state.author_id = data.author_id
      state.content = data.content
      state.cover = data.cover
      state.publish_time = data.publish_time
      state.images = data.images
      state.photonum = data.photonum
    }
  },
  actions: { // 存放异步读取、修改state的的方法。解释一下 action ，所谓异步，就是在 action 文件中写方法，调 axios，然后再 调 mutations 同步修改state。很多人不理解，其实，这就是一个概念性的问题。action并没有从根本上解决异步修改state的竞争问题，但是我们需要理解、并将 异步这个操作 摘出来放在一起。
    delete ({ commit }, id) {
      return api.deleteAlbum(id)
    },
    deletePhoto ({ commit }, { gallery_id, photo_id }) {
      return api.deletePhoto(gallery_id, photo_id)
    },
    addPhoto ({ commit }, { gallery_id, data }) {
      return api.addPhoto(gallery_id, data)
    },
    getAlbum ({ commit }, id) {
      return api.getAlbum(id)
        .then(res => {
          commit(types.GET_ALBUM, res)
        })
    }
  }
}
