import { usePortStore } from '@/common/portStore2.js'
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

    const writeProgram = () => {
        logEvent('Received write command and program')
        writeToPort(ACK)
    }

    const readParameters = () => {
        logEvent('Received read command')
        writeToPort(ACK)
    }

    const reset = () => {
        logEvent('Received reset command')
        writeToPort(ACK)
    }

    const phone = () => {
        logEvent('Received phone command')
        writeToPort(ACK)
    }

    const setTime = () => {
        logEvent('Received set time command')
        writeToPort(ACK)
    }

    const commandResponseMap = new Map(
        [
            [0x03, connectResponse],
            ['NACK', nackResponse],
            [0x00, writeProgram],
            [0x01, readParameters],
            [0x04, reset],
            [0x6E, phone],
            [0x6F, setTime],
        ])


    return Object.freeze({
        commandResponseMap
    })
}