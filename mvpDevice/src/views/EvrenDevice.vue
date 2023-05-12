<template>
    <div class="canvas">
        <section class="grid-structure">
            <header class="card-area"><h1>Evren Device Emulator</h1></header>
            <div class="program card-area">
                <div class="input-area">
                    <div class="input-fields">
                        <h2>Emulator Section</h2>
                        <h3>Message Log</h3>
                        <textarea
                            class="line-breaks" 
                            id="messageLog"
                            v-model="logList" 
                            rows="30" cols="80"
                            readonly="true"/>
                    </div>  
                </div>
            </div>
            <div class="device card-area input-fields">
                <h2>Device Com Manager</h2> 
                <div class="input-fields">
                        <ComManager />
                </div>                                   
            </div>
        </section>        
    </div>

</template>

<script setup>
import { ref } from 'vue'
import ComManager from '@/components/comManager.vue'
import  { useLogStore } from '@/common/logStore.js'
import { storeToRefs } from 'pinia'

console.log('starting EvrenDevice.vue')

const { logList } = storeToRefs(useLogStore())
const messageLog = ref('')

</script>

<style scoped>

.canvas {
    margin: 16px;
    background-color: white;
}

.grid-structure {
    display: grid;
    grid-template-areas: 
        "header header"
        "program device";
    grid-template-rows: 1fr 5fr;
    grid-template-columns: 3fr 1fr;
    gap: 8px;
    margin: 16px;
    background-color: white;
}

header {
    grid-area: header;
    font-size: var(--headlineFont);
    font-weight: var(--titleWeight);
    display: flex;
    align-items: center;
}

.card-area {
    background-color: var(--neutral);
    border-radius: 10px;
    padding: 16px;
}

.input-area {
    display: flex;
    justify-content: space-around;
    gap: 16px;
}

.program {
    grid-area: program;
}

.device {
    grid-area: device;
}

.submit-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0px;
    gap: 16px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

button {
    padding: 4px 12px;
    width: 100px;
    height: 24px;
    border-radius: 4px;
    color: var(--hyperlink);
    font-size: var(--titleFont);
    font-weight: var(--titleWeight);
    vertical-align: center;
    border: none;
    background: transparent;
    cursor: pointer;
}

.row-inputs {
    display: flex;
    justify-content: space-between;
    gap: 8px;
}

.line-breaks {
    white-space: pre-line;
}

</style>