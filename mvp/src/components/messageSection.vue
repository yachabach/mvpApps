<template>
    <section>
        <h2>Message Section</h2>
        <!-- <section class="card-foundation">
            <div class="card-section"> -->
                <button class="button-list" @click="handleHelloWorld">
                    Send Hello World
                </button>                    
                <button class="button-list" @click="handleDeviceConnect">
                    Send Device Connect Message
                </button>                    
                <button class="button-list" @click="handleACK">
                    Send ACK
                </button>                    
                <button class="button-list" @click="handleNACK">
                    Send NACK
                </button>                    
                <form @submit.prevent="sendMessage">
                    <InputField 
                        labelName = "Free Message"
                        id = "free-message"
                        type = "text"
                        error = ""
                        v-model="freeMessage"/>  
                    <button type="submit">Send Free Message</button>              
                </form> 
            <!-- </div>
            <div> -->
                <h3>
                    Sent Messages 
                    <button @click="clearSent">Clear Sent Messages</button>
                </h3>
                <p v-for="msg in sentMessages" :key="msg">{{ msg }}</p>
            <!-- </div>               
        </section> -->
    </section>
</template>

<script setup>
import InputField from '@/components/inputField.vue'
import { usePortStore } from '../common/portStore';
import { DeviceMessageService } from '@/composables/deviceMessageService.js'
import { ref } from 'vue'

const portStore = usePortStore()
const dms = DeviceMessageService()

const freeMessage = ref('')
const sentMessages = ref([])

const addToSentMessages = (msg = 'No Message') => {
    sentMessages.value.push(msg)
}

const handleHelloWorld = () => {
    portStore.writeToPort('Hello World', addToSentMessages)
}

const handleDeviceConnect = () => {
    console.log('Connect message: ', dms.deviceConnectMessage)
    portStore.writeStreamToPort(dms.deviceConnectMessage, addToSentMessages)
}

const handleACK = () => {
    console.log('Connect message: ', dms.ACK)
    portStore.writeToPort(dms.ACK, addToSentMessages)
}

const handleNACK = () => {
    console.log('Connect message: ', dms.NACK)
    portStore.writeToPort(dms.NACK, addToSentMessages)
}

const sendMessage = async () => {
    portStore.writeToPort(freeMessage.value, addToSentMessages)
    freeMessage.value = ''
}

const clearSent = () => {
    sentMessages.value = []
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