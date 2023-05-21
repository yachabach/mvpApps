<template>
<section class="input-fields">
    <h3>Device Parameter Keys</h3>

    <fieldset class="checkbox-list fieldset">
        <legend>Select Parameters</legend>
        <div v-for="key in parameterKeys"
            :key="key" class="inline-labels">
            <CheckboxField 
                :value="key"
                :id="key"
                :labelEnd="key"
                v-model="selectedParameters"/>
        </div>
    </fieldset>

    <div class="input-fields-rows input-border"
        @click="handleOvalClick">

        <ButtonOval 
            id="connectButton"
            :disabled="!!(!portAuthorized | buttonsDisabled)"
            :config="connectButton" 
            :success="true"/>
        <ButtonOval 
            id="readButton"
            :disabled="!!(!portAuthorized | buttonsDisabled)"
            :config="readButton" 
            :success="true"/>
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
import ButtonOval from '@/components/buttonOval.vue'
import CheckboxField from '@/components/checkboxField.vue'
import { DeviceManagerButtonFunctions } from '@/composables/deviceManagerButtonFunctions.js'
import { usePortStore } from '@/common/portStore.js'
import  { useLogStore } from '@/common/logStore.js'
import { storeToRefs } from 'pinia'
import { onUnmounted, ref } from 'vue'

import phoenix100 from '@/defaultConfigs/phoenix100.json'
import { connectButton, readButton } from '@/data/mvpConfig.json'

const parameterKeys = Object.keys(phoenix100.parameterCodes)
const selectedParameters = ref(parameterKeys)

const { initializePort, closeActivePort } = usePortStore()
const { portAuthorized } = storeToRefs(usePortStore())
const { logList } = storeToRefs(useLogStore())
const { ovalButton } = DeviceManagerButtonFunctions()

if (portAuthorized) initializePort()

const buttonsDisabled = ref(false)

const handleOvalClick = async e => {
    buttonsDisabled.value = true
    const res = await ovalButton[e.target.id](selectedParameters.value)
    console.log('Res from dialog button: ', res)
    buttonsDisabled.value = false
}

onUnmounted(()=>closeActivePort())

</script>

<style scoped>
.message-area {
    overflow-y: auto;
    height: 300px;
}

.checkbox-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
}

.fieldset {
    padding: 16px;
    margin: 0px auto;
}


</style>