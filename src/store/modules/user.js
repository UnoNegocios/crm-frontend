import axios from "axios";
const state = {
    users:[],
    total_items:0,
    users_result:[]
};
const getters = {};

const actions = {
    getUsers( {commit}, options){
        return new Promise((resolve, reject) => {
            const { sortBy, sortDesc, page, itemsPerPage } = options
            var link = ''
            if(localStorage.getItem('filtersUser')!=null){
                link = link + JSON.parse(localStorage.getItem('filtersUser'))+'&'
            }
            if(sortBy.length === 1){
                if(sortDesc[0]){
                    link = link + "sort=-" + sortBy[0] + '&'
                }else{
                    link = link + "sort=" + sortBy[0] + '&'
                }
            }
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                commit('setTotalItems', response.data.meta.total);
                commit('setUsers', response.data.data);
            }).finally(() => (resolve(false)))
        })
    },
    searchUsers( {commit}, val){
        return new Promise((resolve, reject) => {
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v1/user/search?filter[name]='+val).then(response => {
                commit('setUsersResult', response.data.data);
            }).finally(() => (resolve(false)))
        })
    },
};

const mutations = {
    setUsers(state, data){
        state.users = data;
    },
    setTotalItems(state, data){
        state.total_items = data;
    },
    setUsersResult(state, data){
        state.users_result = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}