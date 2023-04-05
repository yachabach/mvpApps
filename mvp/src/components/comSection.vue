<template>
    <section>
        <h2>Com Port Section</h2>
        <ItemStatusLine :success="browserCapable"
            :successPhrase="'Browser is COM compatable'"
            :failPhrase="'Browser is NOT COM compatable'"
            :remedy="'Use Chrome, Firefox, or other modern browser'"
        />
        <ItemStatusLine :success="portAuthorized"
            :successPhrase="'COM Port Connected'"
            :failPhrase="'COM Port not connected by user'"
            :remedy="'Use the Connect button to connect a COM port'">
        </ItemStatusLine>
        <div class="button-list">
            <button  
                @click="handleConnectPort">
                Connect Port
            </button>             
            <button
                @click="handleDisconnectPort">
                Disconnect Port
            </button>             
        </div>
        <button class="button-list" @click="handleSeeSignals">Show Port Signals</button>                    
    </section>
</template>

<script setup>
import { usePortStore } from '../common/portStore.js';
import { storeToRefs } from "pinia";
import { useLogStore } from '../common/logStore';
import ItemStatusLine from '@/components/itemStatusLine.vue'

const  portStore = usePortStore();
const { browserCapable, portAuthorized } = storeToRefs(portStore)
const { logEvent } = useLogStore();

portStore.initializePort()

const handleConnectPort = async () => {
    console.log('Authorize a new or different port')
    await portStore.changeActivePort()
}

const handleDisconnectPort = async () => {
    console.log('Disconnecting port');
    await portStore.disconnectPort()
}

const handleSeeSignals = async () => {
    const msg = await portStore.activePortSignals()
    let output = 'Signal Status - '
    Object.keys(msg).forEach(key => {
        output += `${key}: ${msg[key]}; `
    })
    console.log('Port Signals: ', output)
    logEvent(output)
}

</script>

<style scoped>

.button-list {
    display: block;
}

button {
    margin: 8px;
}

</style>