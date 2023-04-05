import { usePortStore } from '../common/portStore.js';
import { storeToRefs } from "pinia";

export const ComService = () => {
    
    const portStore = usePortStore()
    const { activeReader, activeWriter } = storeToRefs(portStore);
    const utfEncoder = new TextEncoder();
    const utfDecoder = new TextDecoder();

    const writeToPort = async (msg, callback = {}) => {
      try {
        activeWriter.value = await portStore.openWriter()
        const utfMsg = utfEncoder.encode(msg);
        await activeWriter.value.write(utfMsg);
        callback(msg)            
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


    return Object.freeze({
        writeToPort,
        readFromPort,
        utfDecoder,
        utfEncoder
    })
}