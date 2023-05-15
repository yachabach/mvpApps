import { usePortStore } from '../common/portStore.js';
import { storeToRefs } from 'pinia';
import { useLogStore } from './logStore'
import { ref } from 'vue';

import phoenix100 from '@/defaultConfigs/phoenix100.json';

export const ComService = () => {
    
    const { activePort } = storeToRefs(usePortStore())
    const { logEvent } = useLogStore()
    const { protocol } = phoenix100.protocol

    const receivedMsgs = ref(Array(0))
    const listening = ref(false)

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
        console.log('msg type: ', typeof(msg))
        await writer.write(utfMsg);
      } catch (err) {
        console.log('Error writing to device: ', err)
      } finally {
        logEvent(`Wrote to COM Port: ${msg}`)
        writer.releaseLock()
      }
    }

    const validateMessage = msg => {
      let err
      if (msg[0] !== protocol.msgInit) {
        err = 'Invalid init: expected 0x' + protocol.msgInit.toString(16) + ' received 0x' + msg[0]
        throw err
      }
      const len = msg.length
      if (len < 3) {
        err = 'Message Length Error: Min: 3; Received: '+ len
        // throw err
        return err
      }
      if (((len-1)*2) != msg[1]) {
        err = 'Message Length Error: Expected: '+ msg[1] + '; Received: '+ ((len-1)*2)
        // throw err
        return err
      }
      return 'valid'
    }
  
    const readFromPortWithTimeout = async timeout => {
      const reader = activePort.value.readable.getReader();
  
      let res = []
      let fin, timeExpired = false
      let msgStatus = 'unknown'
      listening.value = true
      
      //Deadman timeout
      let timer = setTimeout(()=>{
        reader.releaseLock()
        timeExpired = true;
      }, timeout)
  
      while (!fin) {
        try {
          const { value, done } = await reader.read();
          if (done) {
            reader.releaseLock();
            console.log('DONE FOUND!!')
            fin = true
          }
          if (value) {
            res = res.concat(...value)
            msgStatus = validateMessage(res)
            fin = msgStatus === 'valid'
          }
        } catch (error) {
          logEvent('Error in readFromPort: ' + error)
          logEvent('Message status: ' + msgStatus)
          reader.releaseLock()
          listening.value = false
          if (timeExpired) {
            logEvent('Timeout expired')
            const err = 'timeout: ' + msgStatus
            throw err
          } else {
            throw Error('Error in readFromPortWithTimeout: ', {cause: error})
          }
        }
      }
      clearTimeout(timer)
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