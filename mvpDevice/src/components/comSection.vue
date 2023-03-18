<template>
    <section>
        <h2>Com Port Section</h2>
        <section class="card-foundation">
            <div class="card-section">
                <p>Com Port Open: {{ comPortStatus }}</p>
                <span><button class="button-list" @click="handleConnectPort">Connect Port</button> {{ portOpenStatus }}</span>
                <button class="button-list" @click="handleListen">Listen to Port</button>                    
                <button class="button-list" @click="handleHelloWorld">Write Hello World</button>                    
            </div>
            <div class="card-section" >
                <h2>Com Configuration</h2>
                <ul>
                    <li>Browser Capable: {{ browserCapable }}</li>
                    <li>Port Open: {{ comPortStatus }}</li>
                </ul>
            </div>
            <div>
                <h3>
                    Sent Messages 
                    <button @click="clearSent">Clear Sent Messages</button>
                </h3>
                <p v-for="msg in sentMessages" :key="msg">{{ msg }}</p>
            </div> 
            <div>
                <h3>
                    Read Messages 
                    <button @click="clearRead">Clear Read Messages</button>
                </h3>
                <p v-for="msg in readMessages" :key="msg">{{ msg }}</p>
            </div>        
        </section>
    </section>
</template>

<script setup>
import { computed, ref } from "vue"
import { ComService } from '../common/comService.js'

const comService = ComService();

const freeMessage = ref('')
const sentMessages = ref([])
const readMessages = ref([])

const addToSentMessages = (msg = 'No Message') => {
    sentMessages.value.push(msg)
}

const addToReadMessages = (msg = 'No Message') => {
    readMessages.value.push(msg)
}

const handleConnectPort = async () => {
    console.log('Authorize a new or different port')
    comService.adjustConnectedPort()
}

const handleListen = async () => {
    comService.listenToActivePort(addToReadMessages)
}

const handleHelloWorld = () => {
    comService.writeToPort('Hello World', addToSentMessages)
}

const clearSent = () => {
    sentMessages.value = []
}

const clearRead = () => {
    readMessages.value = []
}

const comPortStatus = computed(() => 'Building COM Status')
const browserCapable = comService.browserCapable

</script>

<style scoped>

.button-list {
    margin: 8px;
}

</style>