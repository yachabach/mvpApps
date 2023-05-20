import { ComService } from "@/common/comService"
import { useLogStore } from '@/common/logStore.js'
import {DeviceMessageService} from '@/composables/deviceMessageService.js'

export const DialogEngine = () => {

    const { exchangeMessages, writeToPort } = ComService()
    const { logEvent } = useLogStore()
    const { ACK, NACK, parseResponse } = DeviceMessageService()

    const runDialog = async msg => {
        try {
            console.log('runDialog message: ', msg)
            const res = await exchangeMessages(msg, 5000)
            return res ? 
                await respondToDeviceMessage.get(res[2])(res) :
                await respondToDeviceMessage.get('NACK')()
        } catch (err) {
            console.log('Error in handleConnect Device: ', err)
            return await respondToDeviceMessage.get('NACK')()
        }
    }

    const respondWith = async msg => {
        logEvent('responding with ' + msg)
        return await writeToPort(msg)
    }
    
    const respondToDeviceMessage = new Map(
        [
            [0x02, () => parseResponse],
            [0x03, async () => await respondWith(ACK)],
            ['NACK', async () => {
                await respondWith(NACK)
                return false
            }],
            [0xFF, () => logEvent('ACK received')],
            [0xF0, () => logEvent('NACK received')]
        ])

    const runMessageStream = async messageStream => {
        try {
            return await messageStream.reduce(async (dialogResult, msg) =>{
            //     let flag = await dialogResult
            //     console.log('inside reduce with message: ', msg) 
            //     if (flag) {
            //         flag = await runDialog(msg)
            //         console.log('flag after runDialog: ', flag)
            //         if (flag) {
            //             return true
            //         } else {
            //             return await runDialog(msg)
            //         }
            //     }
            // }
            console.log('inside reduce with message: ', msg) 
            await dialogResult ? await runDialog(msg) ? true : await runDialog(msg) : false}, true)
        } catch (err) {
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