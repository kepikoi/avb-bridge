<template>
    <div class="bridge-unit">

        <div class="input">
            <h2>{{getMidiInputLabel}}</h2>
            <div>
                <button  v-if="!this.cc" @click="enableLearn">{{getLearnMidiText}}</button>
                <button v-if="this.cc" @click="clearAssignment">Clear assignment</button>
            </div>
            <vue-slider :min="0" :max="127" ref="slider" v-model="value"></vue-slider>

        </div>

        <div class="output">
            <h2>
                AVB Output
            </h2>
            <span>
                {{avbTarget}}
            </span>
            <!--<select name="avbtarget" id="avbtarget" v-model="avbTarget">-->
                <!--<option>mix/main/0/matrix/fader</option>-->
                <!--<option>mix/main/0/matrix/mute</option>-->
            <!--</select>-->
        </div>


    </div>
</template>

<script>
    import Vue from 'vue'

    import {mapGetters, mapActions} from 'vuex'
    import vueSlider from 'vue-slider-component'
    import {debug} from '../helpers/debug'
    import Rx from 'rxjs/Rx'

    export default {
        name: 'bridgeunit',
        props: ['avbTarget'],
        data () {
            return {
                value: 0,
                learning: false,
                cc: null,
                maxValue: 4,
                lastEtag: undefined
            }
        },
        components: {
            vueSlider
        },
        computed: Object.assign({}, mapGetters(['currentInput', 'currentPort', 'datastore']), {
            getLearnMidiText(){
                return this.learning ? 'learning midi...' : 'learn midi';
            },
            getMidiInputLabel(){
                return this.cc ? 'MIDI CC '+this.cc : 'MIDI Input';
            }
        }),
        methods: Object.assign({}, mapActions(['']), {
            enableLearn(){
                this.learning = true;
            },
            clearAssignment(){
                this.cc = null;
            },
            learnMidi(cc){
                if (this.learning) {
                    this.cc = cc;
                    debug('assigned CC', cc);
                    this.learning = false;
                }
            },
            isMyController(cc){
                return cc === this.cc;
            },
            setControllerValue(cc, value){
                if (this.isMyController(cc)) {
                    this.value = value
                }
            },
            convertToAvbValue(midiValue, avbMax){
                if (!avbMax) throw 'avbMax required';
                return Math.floor((avbMax / 127 * midiValue) * 100) / 100;
            },
            convertToMidiValue(avbValue, avbMax){
                if (!avbMax) throw 'avbMax required';
                return Math.floor((avbValue / avbMax * 127) * 100) / 100;
            },
            _getAvbResult(datastore){
                if (datastore) {
                    //check cached datastore
                    this.value = this.convertToMidiValue(datastore[this.avbTarget].value, this.maxValue)
                } else {
                    //check live datastore
                    Vue.getAvbValue(this.avbTarget,this.lastEtag)
                        .then(e => {
                            this.value = this.convertToMidiValue(e.data.value, this.maxValue);
                            this.lastEtag = e.etag;
                        })
                }
            },
            _setAvbResult(){
                Vue.setAvbValue(this.avbTarget, this.convertToAvbValue(this.value, this.maxValue))

            },
            polUpdates(){
                Rx.Observable
                    .interval(2000)
                    .subscribe(n => this._getAvbResult())
            }
        }),
        created(){
            this.currentInput.addListener('controlchange', this.currentPort, e => {
//                debug("Received 'controlchange' message.", e);
                this.learnMidi(e.controller.number);
                this.setControllerValue(e.controller.number, e.value)
            });

            this.$watchAsObservable('value')
                .debounce(() => Rx.Observable.timer(100))
                .subscribe(
                    ({newValue, oldValue}) => this._setAvbResult(),
                    err => console.error(err)
                );

            //get inital value
            this._getAvbResult(this.datastore);

            //poll for updates
//            this.polUpdates()


        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .bridge-unit {
        border: 1px solid;
        margin: 1em;
        padding: 1em;
    }


</style>
