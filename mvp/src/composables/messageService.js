import { ComService } from "@/common/comService";
import { DeviceMessageService } from "@/composables/deviceMessageService";
import { useLogStore } from '@/common/logStore'

export const MessageService = () => {

    const {readFromPortWithTimeout, writeToPort} = ComService();
    const {checksumPassed, codeKeys, hiLoBytesToInt} = DeviceMessageService()
    const { logEvent } = useLogStore()

    let messageList = []

    const getMessage = async () => {
        if (!messageList.length) messageList = messageList.concat(await readFromPortWithTimeout(5000))
        const returnMsg = messageList.shift();
        return (returnMsg && checksumPassed(returnMsg)) ? returnMsg : undefined
    }

    const receivedACK = async () => {
        const msg = await getMessage();
        const result = msg ? parseMessage(msg).payload.localeCompare('ACK') === 0 : false;
        logEvent(result ? 'ACK received' : 'ACK not received');
        return result;
    }

    const sendWriteMessageList = async messageList => {
        return messageList.reduce(async (result, msg) => {
            if (await result) {
                await writeToPort(msg)
                return await receivedACK()
            }
        }, true)
    }

    const sendReadMessageList = async readList => {
        return readList.reduce(async (result, msg) => {
            if (await result) {
                await writeToPort(msg)
                if (await receivedACK()) {
                    const param = parseMessage(await getMessage())
                    console.log('received and parsed parameter: ', param)
                    logEvent('parameter: '+ param.payload[0] + '; value: '+ param.payload[1])
                    return true
                } else return false
            }
        }, true)        
    }

    const parseMessage = msg => {
        return {
            code: msg[2], 
            payload: msg[2] == 2 ? 
                [
                    codeKeys[msg[3]], 
                    hiLoBytesToInt(msg.slice(-3, -1))
                ] : 
                msg[2] == 255 ? 'ACK' : 'NACK'
        }
    }

    return Object.freeze({
        getMessage,
        parseMessage,
        receivedACK,
        sendWriteMessageList,
        sendReadMessageList
    })
}