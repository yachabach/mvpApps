import { ComService } from "@/common/comService"
import { useLogStore } from '@/common/logStore.js'
import {DeviceMessageService} from '@/composables/deviceMessageService.js'

export const DialogEngine = () => {

    const { exchangeMessages, writeToPort } = ComService()
    const { logEvent } = useLogStore()
    const { ACK, NACK, parseResponse } = DeviceMessageService()

    const runDialog = async msg => {
        try {
            const res = await exchangeMessages(msg, 5000)
            return res ? 
                respondToDeviceMessage.get(res[2])(res) :
                respondToDeviceMessage.get('NACK')()
        } catch (err) {
            console.log('Error in handleConnect Device: ', err)
            return respondToDeviceMessage.get('NACK')()
        }
    }

    const respondWith = async msg => {
        logEvent('responding with ' + msg)
        return await writeToPort(msg)
    }
    
    const respondToDeviceMessage = new Map(
        [
            [0x02, () => parseResponse],
            [0x03, () => respondWith(ACK)],
            ['NACK', () => {
                respondWith(NACK)
                return false
            }],
            [0xFF, () => logEvent('ACK received')],
            [0xF0, () => logEvent('NACK received')]
        ])

    const runMessageStream = async messageStream => {
        try {
            return messageStream.reduce(async (dialogResult, msg) => 
            dialogResult ? await runDialog(msg) ? true : await runDialog(msg) : false, true)
        }catch (err) {
            console.log('runMessageStream error: ', err)
            logEvent('message stream failed with: ', err)
            return false
        }
    }

    return Object.freeze({
        runDialog,
        runMessageStream,
    })
}