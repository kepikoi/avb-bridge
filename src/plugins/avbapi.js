import axios from 'axios';
import {debug} from '../helpers/debug';

class AvbApi {

    constructor() {
        this.cid = Math.round(Math.random() * 10000000);
        this.avbUri = 'http://192.168.2.30/'
    }

    install(Vue, options) {
        Vue.setAvbValue = (endpoint, value) => new Promise((resolve, reject) => {
            console.log("set avb value", endpoint, value);

            const formData = AvbApi.getFormData(endpoint, value);
            const avbUri = this._getAvbUri();

            axios({
                method: 'patch',
                url: avbUri,
                data: formData,
                params: {
                    client: this.cid
                }
            })
                .then(response => {
                    debug(avbUri + ' requested with', formData);
                    resolve({data: response.data});
                })
                .catch(e => reject)
        });

        Vue.getAvbValue = (endpoint,etag=0) => new Promise((resolve, reject) => {

            console.log("get avb value for etag "+etag, endpoint || '/');
            const avbUri = this._getAvbUri(endpoint);

            const config = {
                method: 'get',
                url: avbUri,
                params: {
                    client: this.cid
                }
            };

            if(etag){
                config.headers = {'If-None-Match': etag}
            }

            axios(config)
                .then(response => {
                    debug(avbUri + ' requested');
                    resolve({data: response.data, etag: response.headers.etag});
                })
                .catch(e => reject)

        });
    };

    _getAvbUri(path = '') {
        return `${this.avbUri}datastore/${path}`;
    }

    static getFormData(endpoint, value) {
        const formData = new FormData();
        const conf = {
            [endpoint]: value
        };
        formData.append('json', JSON.stringify(conf));
        return formData;
    }

}


export default new AvbApi;