import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import light from './vuetify/light-theme'
import dark from './vuetify/dark-theme'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: { 
            light,
            dark
        },
    }
});
