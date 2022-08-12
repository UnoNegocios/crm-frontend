import axios from "axios";
const state = {
  user: {},
  invalidLogin:false
};
const getters = {};
const actions = {
  getUser({ commit }) {
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current").then(response => {
      commit("setUser", response.data.data);
    });
  },
  loginUser({ commit }, user) {
    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/login", {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem("token", response.data.access_token);
          window.location.replace("/");
          location.reload();
        }else{
          commit("setInvalidLogin", true);
        }
      }).catch(error=>{
        commit("setInvalidLogin", true);
      })
  },
  logoutUser() {
    localStorage.removeItem("token");
    window.location.replace("/");
    location.reload();
  }
};
const mutations = {
  setUser(state, data) {
    state.user = data;
  },
  setInvalidLogin(state, data){
    state.invalidLogin = data
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
