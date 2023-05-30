import { ComService } from "@/common/comService";
import { DeviceMessageService } from "@/composables/deviceMessageService";
import { useLogStore } from '@/common/logStore'
import { mapWritableState } from "pinia";

export const MessageService = () => {

    const {readFromPortWithTimeout, writeToPort} = ComService();
    const {checksumPassed, codeKeys, hiLoBytesToInt} = DeviceMessageService()
    const { logEvent } = useLogStore()

    let messageList = []

    const getMessage = async () => {
        console.log('starting getMessage...')
        if (!messageList.length) messageList = messageList.concat(await readFromPortWithTimeout(5000))
        console.log('MessageList from getMessage: ', messageList);
        const returnMsg = messageList.shift();
        console.log('returnMsg: ', returnMsg)
        return (returnMsg && checksumPassed(returnMsg)) ? returnMsg : undefined
    }

    const receivedACK = async () => {
        console.log('looking for ACK')
        const msg = await getMessage();
        const result = msg ? parseMessage(msg).payload.localeCompare('ACK') === 0 : false;
        logEvent(result ? 'ACK received' : 'ACK not received');
        return result;
    }

    const sendProgramMessageList = async messageList => {
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
        sendProgramMessageList,
        sendReadMessageList
    })
}