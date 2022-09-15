import { queryAllBlogs } from '../../api/article'

const state = {
  blogs: []
}
const mutations = {
  GET_ALL_BLOGS(state, blogs) {
    state.blogs = blogs
  }
}
const actions = {
  getAllBlogs({ commit, state }, listQuery) {
    return queryAllBlogs(listQuery).then(res => {
      if (res.code === 200) {
        commit('GET_ALL_BLOGS', res.data)
        return new Promise((resolve, reject) => {
          resolve(res)
        })
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
