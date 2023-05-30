import { usePortStore } from '../common/portStore.js';
import { storeToRefs } from 'pinia';
import { useLogStore } from './logStore'
import { ref } from 'vue';

import phoenix100 from '@/defaultConfigs/phoenix100.json';

export const ComService = () => {
    
    const { getReaderWithTimeout } = usePortStore()
    const { activePort, listening } = storeToRefs(usePortStore())
    const { logEvent } = useLogStore()

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
        result = await writer.write(utfMsg);
      } catch (err) {
        logEvent('Error writing to device: ', err)
      } finally {
        await writer.releaseLock()
      }
      return result
    }

    const validateStream = stream => {
      if (stream[0] != msgInit) {
        logEvent('Invalid start character - discarding data stream')
        return []
      } else return stream
    }

    const pullMessagesFrom = (stream, list) => {
      console.log('pulling from: ', stream)
      const msgEnd = parseInt(stream[1],16)+2
      if (isNaN(msgEnd) || stream.length < msgEnd) {
        console.log('falling out of recursion: msgEnd: ', msgEnd, ' stream: ', stream)
        return {msgStream: stream, msgList: list}
      } else {
        const msgStream = [...validateStream(stream)]
        const newList = list.concat([msgStream.slice(0, msgEnd)])
        return pullMessagesFrom(msgStream.slice(msgEnd), newList)
      }
    }
  
    //TODO: Refactor - fix deadman and error logic
    const readFromPortWithTimeout = async timeout => {
  
      let msgStream = []
      let msgList = []
      let fin = false

      const { deadman, reader } = await getReaderWithTimeout(timeout)
  
      while (!fin) {
        try {
          const { value, done } = await reader.read();
          if (done) {
            fin = true
            console.log('DONE FOUND!!')
          }
          if (value) {
            clearTimeout(deadman.timer);
            msgStream = msgStream.concat(...value);
            ({msgStream, msgList} = pullMessagesFrom(msgStream, msgList));
            fin = !msgStream.length;
            console.log({msgStream, msgList}, ' fin: ', fin)
            deadman.timer = deadman.resetTimer(timeout);
          }
        } catch (error) {
          if (!listening.value) {
            logEvent('Timeout expired')
          } else {
            logEvent('Error in readFromPort: ' + error)
            reader.releaseLock()
            clearTimeout(deadman.timer)
            // throw Error('Error in readFromPortWithTimeout: ', {cause: error})
          }
          fin = true
        } 
      }
      console.log('finishing readFromPortWithTimeout(). msgList: ', msgList)
      
      clearTimeout(deadman.timer)
      listening.value = false
      reader.releaseLock();
      return msgList
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
        addReceivedMessage,
        pullMessagesFrom,
        readFromPortWithTimeout
    })
}