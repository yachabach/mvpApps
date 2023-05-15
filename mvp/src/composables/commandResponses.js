import { usePortStore } from '@/common/portStore.js'
import {DeviceMessageService} from '@/composables/deviceMessageService.js'
import { useLogStore } from '@/common/logStore.js'

console.log('starting commandResponse file')

export const CommandResponses = () => {

    const { writeToPort, } = usePortStore()
    const { logEvent } = useLogStore()    
    const { ACK, NACK } = DeviceMessageService()

    const connectResponse = () => {
        logEvent('responding with ACK')
        writeToPort(ACK)
    }

    const nackResponse = () => {
        logEvent('responding with NACK')
        writeToPort(NACK)
    }

    const commandResponseMap = new Map(
        [
            [0x03, connectResponse],
            ['NACK', nackResponse],
            [0xFF, () => logEvent('ACK received')],
            [0xF0, () => logEvent('NACK received')]
        ])


    return Object.freeze({
        commandResponseMap
    })
}