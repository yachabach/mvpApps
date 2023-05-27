import { ComService } from "@/common/comService"
import { useLogStore } from '@/common/logStore.js'
import {DeviceMessageService} from '@/composables/deviceMessageService.js'

export const DialogEngine = () => {

    const { exchangeMessages, writeToPort, pullMessagesFrom } = ComService()
    const { logEvent } = useLogStore()
    const { ACK, NACK, parseResponse } = DeviceMessageService()

    const runDialog = async msg => {
        try {
            console.log('runDialog message: ', msg)
            //TODO: implement message list - look for desired msg in list
            //if list is empty listen for more messages.  If message is 
            //wrong, make a log entry
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
            [0x02, msg => parseResponse(msg)],
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
            console.log('message stream: ', messageStream)
            return await messageStream.reduce(async (dialogResult, msg) =>
                await dialogResult ? await runDialog(msg) ? true : await runDialog(msg) : false, true)
        } catch (err) {
            console.log('runMessageStream error: ', err)
            logEvent('message stream failed with: ', err)
            return false
        }
    }

// console.log('running pullMessages with: ');
// const testStream = ['0x37', '0x02', '0xFF', '0x38','0x37', '0x05', '0x02', '0x47', '0x01', '0x1A', '0xa0', '0x37', '0x05', '0x02', '0x47', '0x01', '0x1A']
// let msgList = [];
// let msgStream = [];
// ({msgList, msgStream} = pullMessagesFrom(msgList, testStream))
// console.log('result of pull: ', {msgList, msgStream})


    return Object.freeze({
        runDialog,
        runMessageStream,
    })
}