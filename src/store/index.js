import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import * as actions from './actions'
import * as types from './types';

import {debug} from '../helpers/debug';


const state = {
    inputs: [],
    currentInput: null,
    currentPort: 1,
    datastore: null
};


const mutations = {
    [types.LOAD_INPUTS] (state, inputs) {
        state.inputs = inputs
    },
    [types.SET_INPUT] (state, input) {
        state.currentInput = input;
    },
    [types.SET_PORT] (state, port) {
        state.currentPort = port;
    },
    [types.FETCH_DATASTORE] (state, datastore) {
        state.datastore = datastore;
    },
};

const getters = {
    inputs: state => state.inputs,
    currentInput: state => state.currentInput,
    currentPort: state => state.currentPort,
    datastore: state => state.datastore,
};


export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    strict: true
})