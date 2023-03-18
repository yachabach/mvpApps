import { usePortStore } from '../common/portStore.js';
import { storeToRefs } from "pinia";

export const ComService = () => {
    
    const { activePort, activeReader, activeWriter, stopListening, keepListening } = storeToRefs(usePortStore());
    const portStore = usePortStore()
    const utfEncoder = new TextEncoder();
    const utfDecoder = new TextDecoder();

    const writeToPort = async msg => {
      try {
        activeWriter.value = await portStore.openWriter()
        const utfMsg = utfEncoder.encode(msg);
        await activeWriter.value.write(utfMsg)            
      } catch (err) {
          console.log('Error writing to device: ', err)
      } finally {
          await portStore.closeWriter()
      }
    }

    const readFromPort = async () => {
      try {
        activeReader.value = await portStore.openReader()
        const { value, done } = await activeReader.value.read()
        return { value, done }        
      } catch (err) {
          console.log('Error in readFromPort: ', err)
      } finally {
        await portStore.closeReader()
      }
    } 

    // from: https://developer.chrome.com/en/articles/serial/
    const listenToActivePort = async () => {
      while (activePort.value.readable) {
        activeReader.value = await portStore.openReader();

        try {
          while (true) {
            console.log('in the true')
            const { value, done } = await activeReader.value.read();
            if (done) {
              // Allow the serial port to be closed later.
              break;
            }
            if (value) {
              console.log(value);
            }
          }
        } catch (error) {
          console.log('Non-fatal error in listen to port: ', error)
        } finally {
          await portStore.closeReader();
        }
      }  
    }

    return Object.freeze({
        writeToPort,
        readFromPort,
        listenToActivePort,
        utfDecoder,
        utfEncoder
    })
}