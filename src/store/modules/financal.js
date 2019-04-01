import { getFinancal, postFinancal, putFinancal, financalOrder } from '@/api/financal';
const financal = {
  state: {
    financialList: {},
    financialOrder: {}
  },
  mutations: {
    SET_FINANCIAL_LIST: (state, payload) => {
      state.financialList = payload
    },
    SET_FINANCIAL_ORDER: (state, payload) => {
      state.financialOrder = payload
    }
  },
  actions: {
    getFinancialList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        getFinancal(payload).then((res) => {
          commit('SET_FINANCIAL_LIST', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getFinancialListById({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        getFinancal(payload).then((res) => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    createFinancial({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        postFinancal(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    modifyFinancial({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        putFinancal(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    getFinancalOrder({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        financalOrder(payload).then((res) => {
          commit('SET_FINANCIAL_ORDER', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}
export default financal;
