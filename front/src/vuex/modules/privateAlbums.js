import {
  GET_MY_ALBUMS,
  GET_MY_ALBUMS_FAILURE
} from '../mutation-types'

const state = {
  list: [],
  total: 0
}

const mutations = {
  [GET_MY_ALBUMS](state, data) {
    state.list = data.list
    state.total = data.total
  },
  [GET_MY_ALBUMS_FAILURE](state) {
    return state
  },
}

export default {
  state,
  mutations
}