<template>
<section class="input-fields">
<h3>Device Manager</h3>
    <div class="input-fields input-border">
        <ButtonOval
            id="portAuthButton" 
            :config="portAuthButton" 
            :success="portAuthorized"
            @ovalClick="handleAuthorizePort" />
        <ButtonOval 
            id="listenButton"
            :disabled="!!(!portAuthorized | activeListen)"
            :config="listenButton" 
            :success="true"
            @ovalClick="handleListen" />
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
</section>  
</template>

<script setup>
import StatusLine from '@/components/statusLine.vue'
import ButtonOval from '@/components/buttonOval.vue'
import { portAuthButton} from '@/data/mvpConfig.json'

import { usePortStore } from '@/common/portStore.js'
import { storeToRefs } from 'pinia'
import { computed, onUnmounted, reactive } from 'vue'
import { CommandResponses } from '@/composables/commandResponses.js'
console.log('starting ComManager')

const { portAuthorized, activeListen } = storeToRefs(usePortStore())
const { 
    changeActivePort, 
    initializePort, 
    readFromPortWithTimeout,
    closeActivePort } = usePortStore()
const { commandResponseMap } = CommandResponses()
const listenButton = {
        "successPhrase": "Listen to port",
        "failPhrase": "",
        "remedy": ""        
    }  

if (portAuthorized) {
    initializePort()
}

const device = reactive({
    target: {
        deviceId: '',
        connected: Boolean,
        lastProgamTime: '',
        lastProgramName: ''
    }
})

const emulator = {
    deviceId: 'emulator',
    serialNumber: '0000'
}

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

const deviceConnected = computed(() => !!device.target.deviceId)
const deviceProgrammed = computed(() => !!device.target.lastProgamTime)

const handleAuthorizePort = async (e) => {
    device.target.deviceId = ''
    console.log('Auth port button: ', e.target)
    await changeActivePort()
}

const handleListen = async () => {
    let res = ''
    console.log('Starting Listen')
    try {
        res = await readFromPortWithTimeout(20000)
        commandResponseMap.get(res[2])(res)
    } catch (err) {
        console.log('handleConnectDevice error: ', err)
        commandResponseMap.get('NACK')()
    }
    console.log('activeListen: ', activeListen.value)
    console.log('Result of dialog: ', res) 
}

onUnmounted(()=>closeActivePort())
</script>

<style>

</style>