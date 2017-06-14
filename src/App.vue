<template>
    <div id="app">

        <h1>AVB Bridge</h1>
        <hr>

        <h2> Midi Setup:   </h2>
        <div class="app-input">

            <div class="device">
                <select @change="selectDevice" name="inputs" id="inputs" v-model="selectedInput">
                    <option v-for="input in inputs" v-bind:value="input"> {{input.name}} </option>
                </select>
            </div>
            <div class="port">
                <select @change="selectPort" name="ports" id="ports" v-model="selectedPort">
                    <option v-for="n in 16">{{n}}</option>
                </select>
            </div>
        </div>


        <div v-if="selectedInput" class="app-controll">
            <bridge-unit avb-target="mix/main/0/matrix/fader"></bridge-unit>
            <bridge-unit avb-target="mix/main/0/matrix/mute"></bridge-unit>
            <div @click="addOne" class="add-one">+</div>
        </div>


    </div>
</template>

<script>
    import BridgeUnit from './components/BridgeUnit'
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'app',
        data () {
            return {
                value: 0,
                selectedInput: null,
                selectedPort: 1,
                instances:1
            }
        },
        components: {
            BridgeUnit
        },
        computed: Object.assign({}, mapGetters(['inputs']), {}),
        methods: Object.assign({}, mapActions(['setInput', 'setPort']), {
            selectDevice(){
                this.setInput(this.selectedInput);
            },
            selectPort(){
                this.setPort(this.selectedPort);
            },
            addOne(){
                console.log("addOne");
                this.instances++
            }
        }),
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .app-input {
        display: flex;
        justify-content: center;
    }

    .add-one {
        font-size: 3em;
        cursor: pointer;
        color: lightblue;
    }
</style>
