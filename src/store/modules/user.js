import {userList, userBalance, userLog, userStatus, versionDetail, uploadApp, userType} from '@/api/user'

const user = {
  state: {
    userList: {},
    userBalanceList: [],
    userLogList: {}
  },

  mutations: {
    SET_USER_LIST: (state, payload) => {
      state.userList = payload
    },
    SET_BALANCE_LIST: (state, payload) => {
      state.userBalanceList = payload
    },
    SET_LOG_LIST: (state, payload) => {
      state.userLogList = payload
    }
  },

  actions: {
    getUserList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        userList(payload).then((res) => {
          commit('SET_USER_LIST', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getUserBalanceList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        userBalance(payload).then((res) => {
          commit('SET_BALANCE_LIST', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getUserLogList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        userLog(payload).then((res) => {
          commit('SET_LOG_LIST', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    putUserStatus({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        userStatus(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    getVersionDetails({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        versionDetail().then((res) => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    putApp({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        uploadApp(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    putUserType({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        userType(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default user
