import axios from "axios";
const state = {
    activities:[],
    calendars:[]
};
const getters = {};

const actions = {
    getCatalogs( {commit}, module ){
        return new Promise((resolve, reject) => {
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/catalogs" + module).then(response => {
                commit('setCatalogs', response.data);
            }).finally(() => (resolve(false)))
        })
    }
};

const mutations = {
    setActivities(state, data){
        state.activities = data;
    },
    setCalendars(state, data){
        state.calendars = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}