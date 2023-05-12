<template>
<section class="input-fields">
    <h3>Device Manager</h3>
    <div class="input-fields-rows input-border">
        <ButtonOval
            id="portAuthButton" 
            :config="portAuthButton" 
            :success="portAuthorized"
            @ovalClick="handleAuthorizePort" />
        <ButtonOval 
            id="listenButton"
            :disabled="!!(!portAuthorized | !!buttonsDisabled)"
            :config="listenButton" 
            :success="true"
            @ovalClick="handleConnectDevice" />
        <ButtonOval 
            id="writeButton"
            :disabled="!!(!portAuthorized | !!buttonsDisabled)"
            :config="writeButton" 
            :success="true"
            @ovalClick="handleWrite" />
        <ButtonOval 
            id="readButton"
            :disabled="!!(!portAuthorized | !!buttonsDisabled)"
            :config="readButton" 
            :success="true"
            @ovalClick="handleRead" />
        <ButtonOval 
            id="resetButton"
            :disabled="!!(!portAuthorized | !!buttonsDisabled)"
            :config="resetButton" 
            :success="true"
            @ovalClick="handleReset" />
        <ButtonOval 
            id="phoneButton"
            :disabled="!!(!portAuthorized | !!buttonsDisabled)"
            :config="phoneButton" 
            :success="true"
            @ovalClick="handlePhone" />
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
import {DeviceMessageService} from '@/composables/deviceMessageService.js'
import {portAuthButton, listenButton, writeButton, readButton, resetButton, phoneButton} from '@/data/mvpConfig.json'
import { CommandResponses } from '@/composables/commandResponses.js'

import { usePortStore } from '@/common/portStore2.js'
import  { useLogStore } from '@/common/logStore.js'
import { storeToRefs } from 'pinia'
import { computed, onUnmounted, reactive, ref, watch } from 'vue'

const { portAuthorized, activeListen } = storeToRefs(usePortStore())
const { changeActivePort, initializePort, dialogWithPort, closeActivePort } = usePortStore()
const { programMessageBuilder, connectDevice, READ, PHONE, RESET, SETTIME } = DeviceMessageService()
const { commandResponseMap } = CommandResponses()
const { logList } = storeToRefs(useLogStore())

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

const handleAuthorizePort = async (e) => {
    device.target.deviceId = ''
    console.log('Auth port button: ', e.target)
    await changeActivePort()
}

const handleConnectDevice = async () => {
    buttonsDisabled.value = true
    let res
    try {
        res = await dialogWithPort(connectDevice, 10000)
        commandResponseMap.get(res[2])()
    } catch (err) {
        buttonsDisabled.value = false
        console.log('Error in handleConnect Device: ', err)
        commandResponseMap.get('NACK')()
    }
    buttonsDisabled.value = false
    console.log('Result of dialog: ', res)
}

const handleWrite = async () => {
    buttonsDisabled.value = true
    let res
    const msg = programMessageBuilder(props.program)
    try {
        res = await dialogWithPort(msg, 10000)
        commandResponseMap.get(res[2])()
    } catch (err) {
        buttonsDisabled.value = false
        commandResponseMap.get('NACK')()
    }
    device.target.connected = !!res        
    buttonsDisabled.value = false
}

const handleRead = async () => {
    buttonsDisabled.value = true
    let res
    try {
        res = await dialogWithPort(READ, 10000)
        commandResponseMap.get(res[2])()
    } catch (err) {
        buttonsDisabled.value = false
        commandResponseMap.get('NACK')()
    }
    device.target.connected = !!res        
    buttonsDisabled.value = false
}

const handleReset = async () => {
    buttonsDisabled.value = true
    let res
    try {
        res = await dialogWithPort(RESET, 10000)
        commandResponseMap.get(res[2])()
    } catch (err) {
        buttonsDisabled.value = false
        commandResponseMap.get('NACK')()
    }
    device.target.connected = !!res        
    buttonsDisabled.value = false
}

const handlePhone = async () => {
    buttonsDisabled.value = true
    let res
    try {
        res = await dialogWithPort(PHONE, 10000)
        commandResponseMap.get(res[2])()
    } catch (err) {
        buttonsDisabled.value = false
        commandResponseMap.get('NACK')()
    }
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