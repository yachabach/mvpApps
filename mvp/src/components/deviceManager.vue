<template>
<section class="input-fields">

    <div v-if="showReadDialog" >
        <ChooseKeysModal @paramsSelected="handleParamsSelected"
            @cancelEdit="handleModal"/>
    </div>

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
import ChooseKeysModal from '@/components/chooseKeysModal.vue'

import { DeviceManagerButtonFunctions } from '@/composables/deviceManagerButtonFunctions.js'
import { useProgramStore } from '@/common/programStore.js'
import { usePortStore } from '@/common/portStore.js'
import  { useLogStore } from '@/common/logStore.js'
import { storeToRefs } from 'pinia'
import { onUnmounted, ref } from 'vue'

import phoenix100 from '@/defaultConfigs/phoenix100.json'

const { initializePort, closeActivePort } = usePortStore()
const { portAuthorized } = storeToRefs(usePortStore())
const { logList } = storeToRefs(useLogStore())
const { program } = storeToRefs(useProgramStore())

const selectedParameters = ref([Object.keys(phoenix100.parameterCodes)])

const { ovalButton } = DeviceManagerButtonFunctions()

const showReadDialog = ref(false)

if (portAuthorized) initializePort()

const buttonsDisabled = ref(false)

const handleOvalClick = async e => {
    buttonsDisabled.value = true
    const res = await ovalButton[e.target.id](program.value)
    showReadDialog.value = res === 'openReadModal';
    console.log('Res from dialog using button: ', res)
    buttonsDisabled.value = false
}

const handleModal = () => showReadDialog.value = !showReadDialog.value

const handleParamsSelected = selectedParams => {
    selectedParameters.value = [...selectedParams]
    console.log('Selected parameters now: ', selectedParameters.value)
    showReadDialog.value = !showReadDialog.value
}

onUnmounted(()=>closeActivePort())

</script>

<style scoped>
.message-area {
    overflow-y: auto;
    height: 300px;
}

</style>