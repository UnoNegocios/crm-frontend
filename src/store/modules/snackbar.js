const state = {
    snackbar: {
        show: false,
        message: null,
        color: null
    },
};
const getters = {};

const actions = {};

const mutations = {
    setSnackbar(state, data){
        state.snackbar.show = true
        if(data.message==''){
            state.snackbar = 'ERROR'
        }else{
            state.snackbar.message = data.message
        }
        state.snackbar.color = data.color
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}