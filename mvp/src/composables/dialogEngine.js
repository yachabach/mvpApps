import { ComService } from "@/common/comService"
import { useLogStore } from '@/common/logStore.js'
import {DeviceMessageService} from '@/composables/deviceMessageService.js'

export const DialogEngine = () => {

    const { exchangeMessages, writeToPort } = ComService()
    const { logEvent } = useLogStore()
    const { ACK, NACK } = DeviceMessageService()

    const runDialog = async command => {
        let res = undefined
        try {
            res = await exchangeMessages(command, 5000)
            return res ? 
                respondToDeviceMessage.get(res[2])() :
                respondToDeviceMessage.get('NACK')()
        } catch (err) {
            console.log('Error in handleConnect Device: ', err)
            respondToDeviceMessage.get('NACK')()
        }
    }

    const respondWith = async msg => {
        logEvent('responding with ' + msg)
        await writeToPort(msg)
        return true        
    }
    
    const respondToDeviceMessage = new Map(
        [
            [0x03, () => respondWith(ACK)],
            ['NACK', () => respondWith(NACK)],
            [0xFF, () => logEvent('ACK received')],
            [0xF0, () => logEvent('NACK received')]
        ])

    return Object.freeze({
        runDialog,
    })
}