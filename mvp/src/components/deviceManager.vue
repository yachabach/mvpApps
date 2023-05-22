<template>
<section class="input-fields">

    <h3>Device Manager</h3>
    <div class="input-fields-rows input-border">
        <DeviceCommandButtons  
            :buttonsDisabled="buttonsDisabled"
            :portAuthorized="portAuthorized"
            @click="handleOvalClick"/>
    </div>

    <h3>Message Log</h3> 
    <div class="input-fields input-border message-area">
        <textarea
            class="line-breaks" 
            id="messageLog"
            v-model="logList" 
            rows="40" cols="60"
            readonly="true"/>        
    </div>

</section>  
</template>

<script setup>
import DeviceCommandButtons from '@/components/deviceCommandButtons.vue'

import { DeviceManagerButtonFunctions } from '@/composables/deviceManagerButtonFunctions.js'
import { useProgramStore } from '@/common/programStore.js'
import { usePortStore } from '@/common/portStore.js'
import  { useLogStore } from '@/common/logStore.js'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const { initializePort } = usePortStore()
const { portAuthorized } = storeToRefs(usePortStore())
const { logList } = storeToRefs(useLogStore())
const { program } = storeToRefs(useProgramStore())
const { ovalButton } = DeviceManagerButtonFunctions()

const buttonsDisabled = ref(false)

//TODO: Refactor - this pattern produces hidden side-effects on program store
const handleOvalClick = async e => {
    buttonsDisabled.value = true
    const res = await ovalButton[e.target.id](program.value)
    console.log('Res from dialog button: ', res)
    buttonsDisabled.value = false
}

onMounted(async () => await initializePort()) 

</script>

<style scoped>
.message-area {
    overflow-y: auto;
    height: 300px;
}

</style>