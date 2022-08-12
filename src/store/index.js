import Vue from 'vue'
import Vuex from 'vuex'

import currentUser from "./modules/currentUser"
import client from "./modules/client"
import user from "./modules/user"
import catalog from "./modules/catalog"
import activity from "./modules/activity"
import snackbar from "./modules/snackbar"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    catalog,
    user,
    currentUser,
    client,
    activity,
    snackbar
  }
})
