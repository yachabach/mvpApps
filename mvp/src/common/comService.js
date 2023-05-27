import { usePortStore } from '../common/portStore.js';
import { storeToRefs } from 'pinia';
import { useLogStore } from './logStore'
import { ref } from 'vue';

import { DeviceMessageService } from '@/composables/deviceMessageService.js';

import phoenix100 from '@/defaultConfigs/phoenix100.json';

export const ComService = () => {
    
    const { getReaderWithTimeout } = usePortStore()
    const { activePort, listening } = storeToRefs(usePortStore())
    const { logEvent } = useLogStore()
    const { checksumPassed } = DeviceMessageService();

    const msgInit = parseInt(phoenix100.protocol.msgInit, 16)

    const receivedMsgs = ref(Array(0))

    const utfEncoder = new TextEncoder();
    // const utfDecoder = new TextDecoder();

    function addReceivedMessage(msg) {
      receivedMsgs.value.shift(msg)
    }
  
    const writeToPort = async (msg) => {
      let result = false
      let writer = undefined
      try {
        writer = await activePort.value.writable.getWriter()
        const fixType = (typeof(msg) === 'string') ? utfEncoder.encode(msg) : msg
        const utfMsg = new Uint8Array(fixType);
        const temp = await writer.write(utfMsg);
        console.log('temp from writeToPort: ', temp)
        result = true;
      } catch (err) {
        logEvent('Error writing to device: ', err)
      } finally {
        logEvent(`Wrote to COM Port: ${msg}`)
        await writer.releaseLock()
      }
      return result
    }

    const validateMessage = msg => {
      console.log('validating message: ', msg)
      let err
      if (msg[0] !== msgInit) {
        err = 'Invalid init: expected ' + msgInit + ' received ' + msg[0]
        throw err
      }
      if (!checksumPassed(msg)) {
        err = 'Checksum Failed'
        // throw err
        return err
      }
      return 'valid'
    }

    const validateStream = stream => {
      console.log('validating stream with stream[0]: ', stream[0])
      if (stream[0] != msgInit) {
        logEvent('Invalid start character - discarding data stream')
        console.log('returning empty array')
        return []
      } else return stream
    }

    const parseMsg = msg => checksumPassed(msg) ? {code: msg[2], payload: msg.split(3)} : undefined

    const pullMessagesFrom = (list, stream) => {
      const msgEnd = parseInt(stream[1],16)+2
      const msgStream = [...validateStream(stream)]
      if (isNaN(msgEnd) || msgStream.length < msgEnd) {
        return {msgList: list, msgStream: msgStream}
      } else {
        const newList = list.concat([msgStream.slice(0, msgEnd)])
        return pullMessagesFrom(newList, msgStream.slice(msgEnd))
      }
    }
  
    const readFromPortWithTimeout = async timeout => {
  
      let msgStream = []
      let msgList = []
      let fin = false
      let msgStatus = 'unknown'

      const { deadman, reader } = await getReaderWithTimeout(timeout)
      console.log('deadman: ', deadman)
  
      while (!fin) {
        try {
          const { value, done } = await reader.read();
          if (done) {
            fin = true
            // reader.releaseLock();
            console.log('DONE FOUND!!')
          }
          if (value) {
            clearTimeout(deadman.timer);
            msgStream = msgStream.concat(...value);
            // msgStream = [...validateStream(msgStream)]
            // {msgStream, msgList} = pullMessagesFrom(msgStream)
            // msgStatus = validateMessage(msgStream)
            ({msgList, msgStream} = pullMessagesFrom(msgList, msgStream));
            fin = !msgStream.length;
            console.log({msgList,  msgStream})
            deadman.timer = deadman.resetTimer(timeout);
          }
        } catch (error) {
          if (!listening.value) {
            logEvent('Timeout expired')
            const err = 'timeout: ' + msgStatus
            throw err
          } else {
            logEvent('Error in readFromPort: ' + error)
            reader.releaseLock()
            throw Error('Error in readFromPortWithTimeout: ', {cause: error})
          }
        }
      }
      clearTimeout(deadman.timer)
      listening.value = false
      reader.releaseLock();
      return msgList
    }
  
    const exchangeMessages = async (sendMsg, timeout) => {
    
      //send message
      const writeResult = await writeToPort(sendMsg)
      console.log("writeResult: ", writeResult)
      
      //listen for response until timeout
      let res = undefined
      try {
        res = await readFromPortWithTimeout(timeout)
      } catch (err) {
        console.log('Listen for response Error: ', err)
      }
      //return response or undefined
      return res
    }

    return Object.freeze({
        writeToPort,
        exchangeMessages,
        addReceivedMessage,
        pullMessagesFrom
    })
}