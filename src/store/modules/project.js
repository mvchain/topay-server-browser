import { projectList, createProject, modifyProject, deleteProject, projectOrder } from '@/api/project';
const project = {
  state: {
    projectList: {},
    projectOrderList: {}
  },
  mutations: {
    SET_PROJECT_LIST: (state, payload) => {
      state.projectList = payload
    },
    SET_PROJECT_ORDER_LIST: (state, payload) => {
      state.projectOrderList = payload
    }
  },
  actions: {
    getProjectList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        projectList(payload).then((res) => {
          commit('SET_PROJECT_LIST', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getProjectInfo({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        projectList(payload).then((res) => {
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    postProjectList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        createProject(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    putProjectList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        modifyProject(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    deleteProjectList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        deleteProject(payload).then((res) => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    getProjectOrderList({commit, state}, payload) {
      return new Promise((resolve, reject) => {
        projectOrder(payload).then((res) => {
          commit('SET_PROJECT_ORDER_LIST', res.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}
export default project;
