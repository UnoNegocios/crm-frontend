import axios from "axios";
const state = {
    catalogs:[]
};
const getters = {};

const actions = {
    getCatalogs( {commit}, module ){
        return new Promise((resolve, reject) => {
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/catalogs" + module).then(response => {
                commit('setCatalogs', response.data);
            }).finally(() => (resolve(false)))
        })
    },
    patchCatalogs( {commit, dispatch}, data){
        return new Promise((resolve, reject) => {
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/catalogs/"+ data.id, data.editedItem).then(response => {
                commit('snackbar/setSnackbar', {
                    message: data.action_type + ' Exitosa',
                    color: 'success'
                }, { root: true })
                resolve(true)
            }).catch(error => {
                dispatch('getCatalogs', '')
                commit('snackbar/setSnackbar', {
                    message: error.response.data.message,
                    color: 'error'
                }, { root: true })
                resolve(false)
            })
        })
    }
};

const mutations = {
    setCatalogs(state, data){
        state.catalogs = data;//Object.freeze(data); -> para que no se modifique al moverle en el componente
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}