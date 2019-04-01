import { blockTx, blockStatus, addrInfo, postBlockTx, blockExportCount, getBrowser, postBrowser } from '@/api/block';
const block = {
  state: {
    blockTxList: {},
    browserList: {}
  },

  mutations: {
    SET_BLOCKTX_LIST: (state, payload) => {
      state.blockTxList = payload
    },
    SET_BROWSER_LIST: (state, payload) => {
      state.browserList = payload
    }
  },

  actions: {
    getBlockTxList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        blockTx(payload).then((res) => {
          commit('SET_BLOCKTX_LIST', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    putBlockStatus({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        blockStatus(payload).then((res) => {
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getAddrInfo({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        addrInfo(payload).then((res) => {
          resolve( res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    postTx({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        postBlockTx(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getExportCount({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        blockExportCount().then((res) => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getBrowserList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        getBrowser(payload).then((res) => {
          commit('SET_BROWSER_LIST', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    postBrowserList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        postBrowser(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default block
