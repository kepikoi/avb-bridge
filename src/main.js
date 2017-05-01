// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/';

import AvbApi from './plugins/avbapi';
Vue.use(AvbApi);

Vue.config.productionTip = true;
import {mapActions} from 'vuex'

import Rx from 'rxjs/Rx'
import VueRx from 'vue-rx'
Vue.use(VueRx, Rx);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: {App},
    store,
    methods: Object.assign({}, mapActions(['loadInputs','fetchDatastore']), {}),
    created(){
        this.loadInputs();
        // this.fetchDatastore();
    }
});
