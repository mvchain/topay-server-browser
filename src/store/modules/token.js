import { tokenList, createToken, modifyTokenSetting, modifyTokenTx, tokenSetting, tokenTx, tokenPair, modifyToken } from '@/api/token';
const token = {
  state: {
    tokenList: [],
    tokenPairList: []
  },
  mutations: {
    SET_TOKEN_LIST: (state, payload) => {
      state.tokenList = payload
    },
    SET_TOKEN_PAIR: (state, payload) => {
      state.tokenPairList = payload
    }
  },
  actions: {
    getTokenList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        tokenList(payload).then((res) => {
          commit('SET_TOKEN_LIST', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getOnlyBlockTokenList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        tokenList(payload).then((res) => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getTokenInfo({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        tokenList(payload).then((res) => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    postTokenList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        createToken(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    putTokenList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        modifyToken(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    putTokenSetting({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        modifyTokenSetting(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getTokenSettingInfo({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        tokenSetting(payload).then((res) => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    putTokenTx({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        modifyTokenTx(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getTokenTxInfo({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        tokenTx(payload).then((res) => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getTokenPair({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        tokenPair().then((res) => {
          commit('SET_TOKEN_PAIR', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}
export default token;
