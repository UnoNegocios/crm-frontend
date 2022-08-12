import axios from "axios";
const state = {
    clients:[],
    total_items:0
};
const getters = {};

const actions = {
    getClients( {commit}, options){
        return new Promise((resolve, reject) => {
            const { sortBy, sortDesc, page, itemsPerPage } = options
            var link = ''
            if(localStorage.getItem('filtersClient')!=null){
                link = link + JSON.parse(localStorage.getItem('filtersClient'))+'&'
            }
            if(sortBy.length === 1){
                if(sortDesc[0]){
                    link = link + "sort=-" + sortBy[0] + '&'
                }else{
                    link = link + "sort=" + sortBy[0] + '&'
                }
            }
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/clients?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                commit('setTotalItems', response.data.meta.total);
                commit('setClients', response.data.data);
            }).finally(() => (resolve(false)))
        })
    },
    postClient( {commit}, data ){
        return new Promise((resolve, reject) => {
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/clients", data).then(response => {
                commit('addClient', data)
                commit('snackbar/setSnackbar', {
                    message: 'Creación Exitosa',
                    color: 'success'
                }, { root: true })
                resolve(true)
            }).catch(error => {
                commit('snackbar/setSnackbar', {
                    message: error.response.data.message,
                    color: 'error'
                }, { root: true })
                resolve(false)
            })
        })
    }
    //patchClients
};

const mutations = {
    setClients(state, data){
        state.clients = data;
    },
    setTotalItems(state, data){
        state.total_items = data;
    },
    addClient(state, data){
        state.clients.push(data);
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}