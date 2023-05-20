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

    const protocol = phoenix100.protocol

    const receivedMsgs = ref(Array(0))

    const utfEncoder = new TextEncoder();
    // const utfDecoder = new TextDecoder();

    function addReceivedMessage(msg) {
      receivedMsgs.value.shift(msg)
    }
  
    const writeToPort = async (msg) => {
      let writer
      try {
        writer = activePort.value.writable.getWriter()
        const fixType = (typeof(msg) === 'string') ? utfEncoder.encode(msg) : msg
        const utfMsg = new Uint8Array(fixType);
        await writer.write(utfMsg);
      } catch (err) {
        console.log('Error writing to device: ', err)
      } finally {
        logEvent(`Wrote to COM Port: ${msg}`)
        writer.releaseLock()
      }
    }

    const validateMessage = msg => {
      console.log('validating message: ', msg)
      let err
      if (msg[0] !== parseInt(protocol.msgInit,16)) {
        err = 'Invalid init: expected ' + protocol.msgInit + ' received ' + msg[0]
        throw err
      }
      if (!checksumPassed(msg)) {
        err = 'Checksum Failed'
        // throw err
        return err
      }
      return 'valid'
    }
  
    const readFromPortWithTimeout = async timeout => {
  
      let res = []
      let fin = false
      let msgStatus = 'unknown'

      const { deadman, reader } = await getReaderWithTimeout(timeout)
      console.log('deadman: ', deadman)
  
      while (!fin) {
        try {
          const { value, done } = await reader.read();
          if (done) {
            reader.releaseLock();
            console.log('DONE FOUND!!')
          }
          if (value) {
            clearTimeout(deadman.timer)
            deadman.timer = deadman.resetTimer(timeout)
            res = res.concat(...value)
            msgStatus = validateMessage(res)
            fin = msgStatus === 'valid'
          }
        } catch (error) {
          logEvent('Error in readFromPort: ' + error)
          reader.releaseLock()
          if (!listening.value) {
            logEvent('Timeout expired')
            const err = 'timeout: ' + msgStatus
            listening.value = false
            throw err
          } else {
            throw Error('Error in readFromPortWithTimeout: ', {cause: error})
          }
        }
      }
      clearTimeout(deadman.timer)
      listening.value = false
      reader.releaseLock();
      logEvent('Valid message received: ' + res)
      return res
    }
  
    const exchangeMessages = async (sendMsg, timeout) => {
    
      //send message
      await writeToPort(sendMsg)
      
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
        addReceivedMessage
    })
}