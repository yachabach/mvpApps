<template>
  <section>
    <SectionCardColumn :columnTitle="'Device Controller'">

        <ItemStatusLine
            :success="browserCapable"
            :successPhrase="'Browser is COM compatable'"
            :failPhrase="'Browser is NOT COM compatable'"
            :remedy="'Use Chrome, Firefox, or other modern browser'"
        />
        <div class="flex-row">
            <ItemStatusLine :success="portAuthorized"
            :successPhrase="'COM Port Authorized'"
            :failPhrase="'COM Port not authorized by user'"
            :remedy="'Use the Authorize Port button to authorize a COM port'"
            />
            <button @click="handleAuthorizePort">Authorize Port</button>            
        </div>    
        <ItemStatusLine :success="portOpen"
            :successPhrase="'COM Port is Open'"
            :failPhrase="'COM Port not open'"
            :remedy="'Writing to a device might correct this issue...'"
        />
        <ReceivedMessageViewer :messages="receivedMessages"/>
        <div class="row-button-list">
                <button @click="handleSendConnect">Send Connect Message</button>     
                <button @click="handleSendProgram">Send Program Message</button>     
                <!-- <button type="submit" id="cancel">Cancel</button>             -->
        </div>        
    </SectionCardColumn>

  </section>
</template>

<script setup>
import SectionCardColumn from '@/components/sectionCardColumn.vue'
import ReceivedMessageViewer from '@/components/receivedMessageViewer.vue'
import ItemStatusLine from '@/components/itemStatusLine.vue'

import { usePortStore } from '../common/portStore.js';
import { storeToRefs } from "pinia";
import { DeviceMessageService } from '@/composables/deviceMessageService.js'


const  portStore = usePortStore();
const { browserCapable, portAuthorized, portOpen, receivedMessages } = storeToRefs(portStore)

const dms = DeviceMessageService()

const props = defineProps({
    program: Object
})

portStore.initializePort()

const handleAuthorizePort = () => {
    portStore.changeActivePort()
}

const handleSendConnect = () => {
    portStore.writeToPort(dms.deviceConnectMessage)
}

const handleSendProgram = () => {
    console.log('Handling send...')
    portStore.writeToPort(dms.deviceMessageBuilder(props.program))
}

</script>

<style scoped>
.row-button-list {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.flex-row {
    display: flex;
    justify-content: flex-start;
    gap: 4px;
}


</style>