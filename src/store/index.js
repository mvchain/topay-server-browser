import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import login from './modules/login'
import admin from './modules/admin'
import project from './modules/project'
import block from './modules/block'
import user from './modules/user'
import token from './modules/token'
import financal from './modules/financal'
import supplier from './modules/supplier'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    login,
    admin,
    user,
    project,
    block,
    supplier,
    token,
    financal
  },
  getters
})

export default store
