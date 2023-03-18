<template>
    <section>
        <h2>Com Port Section</h2>
        <section class="card-foundation">
            <div class="card-section">
                <span><button class="button-list" @click="handleConnectPort">Connect Port</button> {{ portOpenStatus }}</span>
                <button class="button-list" @click="handleListen">Listen to Port</button>                    
                <button class="button-list" @click="handleSeeSignals">See Signals</button>                    
                <button class="button-list" @click="handleSeePortStatus">See Port Status</button>                    
                <button class="button-list" @click="handleRead">Read Data</button>                    
                <button class="button-list" @click="handleWrite">Write Hello World</button>                    
            </div>
            <div class="card-section" >
                <h2>Com Configuration</h2>
                <ul>
                    <li>Browser Capable: {{ browserCapable }}</li>
                    <li>Port Open: {{ portOpenStatus }}</li>
                </ul>
            </div>
        </section>
    </section>
</template>

<script setup>
import { usePortStore } from '../common/portStore.js';
import { storeToRefs } from "pinia";
import { ComService } from '../common/comService.js'

const  portStore = usePortStore();
const { browserCapable, portOpenStatus } = storeToRefs(usePortStore())
const comService = ComService();

const handleConnectPort = async () => {
    console.log('Authorize a new or different port')
    await portStore.changeActivePort()
}

const handleListen = async () => {
    comService.listenToActivePort()
}

const handleSeeSignals = async () => {
    console.log('Port Signals: ', await portStore.activePortSignals())
}

const handleSeePortStatus = async () => {
    console.log('Port Signals: ', await portStore.portStatus())
}

const handleWrite = async () => {
    const msg = "Hello World"
    await comService.writeToPort(msg)
}

const handleRead = async () => {
    const { value, done } = await comService.readFromPort()
    const decodeValue = comService.utfDecoder.decode(value)
    console.log('Read values in handle read: ', {decodeValue, done})
}

</script>

<style scoped>

.button-list {
    margin: 8px;
}

</style>