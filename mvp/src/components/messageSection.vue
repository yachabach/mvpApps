<template>
    <section>
        <h2>Message Section</h2>
        <section class="card-foundation">
            <div class="card-section">
                <button class="button-list" @click="handleHelloWorld">
                    Send Hello World
                </button>                    
                <form @submit.prevent="sendMessage">
                    <InputField 
                        labelName = "Free Message"
                        id = "free-message"
                        type = "text"
                        error = ""
                        v-model="freeMessage"/>                
                </form> 
            </div>
            <div>
                <h3>
                    Sent Messages 
                    <button @click="clearSent">Clear Sent Messages</button>
                </h3>
                <p v-for="msg in sentMessages" :key="msg">{{ msg }}</p>
            </div>               
        </section>
    </section>
</template>

<script setup>
import InputField from '@/components/inputField.vue'
import { ComService } from '../common/comService.js'
import { ref } from 'vue'

const comService = ComService();

const freeMessage = ref('')
const sentMessages = ref([])

const addToSentMessages = (msg = 'No Message') => {
    sentMessages.value.push(msg)
}

const handleHelloWorld = () => {
    comService.writeToPort('Hello World', addToSentMessages)
}

const sendMessage = async () => {
    console.log('writing freemessage: ', freeMessage.value)
    comService.writeToPort(freeMessage.value)
}

const clearSent = () => {
    sentMessages.value = []
}

</script>

<style>

</style>