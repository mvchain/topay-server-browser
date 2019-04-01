import {getBatch} from '@/api/supplier'

const supplier = {
  state: {
    batchData: {}
  },

  mutations: {
    SET_BATCH_DATA: (state, payload) => {
      state.batchData = payload
    }
  },

  actions: {
    getBatchData({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        getBatch(payload).then((res) => {
          commit('SET_BATCH_DATA', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default supplier
