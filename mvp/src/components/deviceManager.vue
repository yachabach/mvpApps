<template>
<section class="input-fields">
    <h3>Device Manager</h3>
    <div class="input-fields-rows input-border">
        <ul @ovalClick="handleOvalClick">
            <ButtonOval
                id="portAuthButton" 
                :config="portAuthButton" 
                :success="portAuthorized"/>
            <ButtonOval 
                id="connectButton"
                :disabled="!!(!portAuthorized | !!buttonsDisabled)"
                :config="connectButton" 
                :success="true"/>
            <ButtonOval 
                id="writeButton"
                :disabled="!!(!portAuthorized | !!buttonsDisabled)"
                :config="writeButton" 
                :success="true"/>
            <ButtonOval 
                id="readButton"
                :disabled="!!(!portAuthorized | !!buttonsDisabled)"
                :config="readButton" 
                :success="true"/>
            <ButtonOval 
                id="resetButton"
                :disabled="!!(!portAuthorized | !!buttonsDisabled)"
                :config="resetButton" 
                :success="true"/>
            <ButtonOval 
                id="phoneButton"
                :disabled="!!(!portAuthorized | !!buttonsDisabled)"
                :config="phoneButton" 
                :success="true"/>
        </ul>
    </div>
    <h3>Device Status</h3>
    <div class="input-fields input-border">
        <StatusLine 
            :config="deviceMessages"
            :success="deviceConnected"/>
        <StatusLine 
            :config="programMessages"
            :success="deviceProgrammed"/>
    </div> 
    <h3>Message Log</h3> 
    <div class="input-fields input-border message-area">
    <textarea
        class="line-breaks" 
        id="messageLog"
        v-model="logList" 
        rows="30" cols="60"
        readonly="true"/>        
    </div>

</section>  
</template>

<script setup>
import StatusLine from '@/components/statusLine.vue'
import ButtonOval from '@/components/buttonOval.vue'
import {portAuthButton, connectButton, writeButton, readButton, resetButton, phoneButton} from '@/data/mvpConfig.json'
import { DeviceManagerButtonFunctions } from '@/composables/deviceManagerButtonFunctions.js'

import { usePortStore } from '@/common/portStore.js'
import  { useLogStore } from '@/common/logStore.js'
import { storeToRefs } from 'pinia'
import { computed, onUnmounted, reactive, ref } from 'vue'

const { portAuthorized } = storeToRefs(usePortStore())
const { initializePort, closeActivePort } = usePortStore()
const { logList } = storeToRefs(useLogStore())
const { ovalButton } = DeviceManagerButtonFunctions()
const props = defineProps(['program'])

const device = reactive({
    target: {
        deviceId: '',
        connected: Boolean,
        lastProgamTime: '',
        lastProgramName: ''
    }
})

if (portAuthorized) {
    initializePort()
}

const buttonsDisabled = ref(false)

const deviceMessages = computed(() => {
    return {
        successPhrase: 'Connected Device ID: ' + device.target.deviceId,
        failPhrase: 'Device not connected'            
    }
})

const programMessages = computed(() => {
    return {
        successPhrase: 'Last Program: ' + device.target.lastProgramName +
            ' at: ' + device.target.lastProgamTime,
        failPhrase: 'Device not programmed'            
    }
})

const deviceConnected = computed(() => !!device.target.connected)
const deviceProgrammed = computed(() => !!device.target.lastProgamTime)

const handleOvalClick = async e => {
    buttonsDisabled.value = true
    console.log('target id clicked: ', e.target.id)
    const res = await ovalButton[e.target.id](props.program)
    console.log('Res from dialog using button: ', res)
    buttonsDisabled.value = false
}

onUnmounted(()=>closeActivePort())

</script>

<style scoped>
.message-area {
    overflow: scroll;
    height: 200px;
}

.input-fields-rows {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
}
</style>