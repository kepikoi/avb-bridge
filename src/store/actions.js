import * as types from './types';
import WebMidi from 'webmidi';
import Vue from 'vue'


/**
 * load all midi inputs
 * @param commit
 */
export const loadInputs = ({commit}) => {
    WebMidi.enable(function (err) {
        if (err) {
            console.log("WebMidi could not be enabled.", err);
        } else {
            console.log("WebMidi enabled!", WebMidi.inputs);
            commit(types.LOAD_INPUTS, WebMidi.inputs)
        }
    });
};

/**
 * set input to listen to
 * @param commit
 * @param input
 */
export const setInput = ({commit}, input) => {
    commit(types.SET_INPUT, input)
};

/**
 * set midi port to listen to
 * @param commit
 * @param input
 */
export const setPort = ({commit}, port) => {
    commit(types.SET_PORT, port)
};


/**
 * fetches dataStoreValues
 * @param commit
 */
export const fetchDatastore = ({commit})=>{
    Vue.getAvbValue().then(datastore=>{
        console.log("datastore",datastore);
        commit(types.FETCH_DATASTORE, datastore)
    })
};