import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useLogStore } from './logStore'
import { SerialCodes } from '../composables/serialCodes'
import config from '@/data/mvpConfig.json'

export const  usePortStore = defineStore('port', () => {
  
  const { logEvent } = useLogStore()
  const { com_protocol } = SerialCodes()

  // logEvent('Started portStore')
  console.log('starting portStore2')

  //state
  const activePort = ref(undefined)
  const receivedMsgs = ref(Array(0))
  const listening = ref(false)

  //getters
  const browserCapable = computed(() => { return "serial" in navigator})
  const portAuthorized = computed(() => !!activePort.value)
  const receivedMessages = computed(() => receivedMsgs.value)
  const activeListen = computed(() => !!listening.value)

  //actions
  async function changeActivePort() {
    const newPort = await authorizePort()
    if (newPort) {
      console.log('forgetting active port...')
      await forgetPort(activePort.value)
      activePort.value = [...await navigator.serial.getPorts()][0]
      await initializePort()
    }
  }

  function addReceivedMessage(msg) {
    receivedMsgs.value.shift(msg)
  }

  /**
   * We allow only one port to be authorized.  We also force
   * the user to authorize a port if one isn't already authorized
   * since we cannot do it programatically.
   */
  async function initializePort() {
    console.log('starting initializePort')
    await trimPorts()
    if (!activePort.value) {
      alert('No COM port connected.')
    } else {
      logEvent('Opening Port')
      await openActivePort();
    }
  }

  /**Serial Port authorization
   * 
   * In javascript, the user must actively request and authorize
   * any local serial port that is to be used.
   */
  async function authorizePort() {
    let res = undefined
    try {
        res = await navigator.serial.requestPort()
    }
    catch (err) {
        console.log('Error in authorizePort: ', err)
    }
    return res
  }
  
  const forgetPort = async port => {
    if (port) {
      try {  
        await port.forget();
        port = undefined
      } catch (err) {
        console.log('Error in portStore forgetting active port: ', err)
      }
    }
  }

  //Leave only port[0] authorized
  const trimPorts = async () => {
    const allPorts = [...await navigator.serial.getPorts()]
    for (let i=1; i<allPorts.length; i++) {
      console.log('trimming port ', i, ' of ', allPorts.length)
      await forgetPort(allPorts[i])
    }
  }
  
  const openActivePort = async () => {
    try {
      await activePort.value.open(config.comProtocol)
    }catch (err) {
      console.log('Error in portStore opening active port: ', err)
    }
  }

  const disconnectPort = async () => {
    await forgetPort(activePort.value)
    await initializePort()
  }

  const closeActivePort = async () => {
    try {
      await activePort.value.close()
    } catch (err) {
      console.log('Error closing port in portStore.js')
    }
  }

  const portStatus = async () => {
    let status = ''
    if (activePort.value) {
        console.log('Checking port status')
        const res = await activePort.value.readable.locked
        status = res ? 'port is locked': 'port is not locked'
    } else {
        console.log('no port to check')
        status = 'No port to check'
    }
    return status
  }

  const activePortSignals = async () => {
    return await activePort.value.getSignals()
  }

  
  const validateMessage = msg => {
    let err
    if (msg[0] !== com_protocol.msgInit) {
      err = 'Invalid init: expected 0x' + com_protocol.msgInit.toString(16) + ' received 0x' + msg[0]
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

  const findValidMessage = msg => {
    const newMessage = msg.slice(0, msg[1])
    console.log('Finding valid message in: ', newMessage)
    if (validateMessage(newMessage) === 'valid') {
      logEvent('Extracted valid message - discarded remainder')
      return newMessage
    }
    return undefined
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
        reader.releaseLock()
        listening.value = false
        if (timeExpired) {
          logEvent('Timeout expired')
          res = findValidMessage(res)
          if (res) return res
          const err = 'timeout: ' + msgStatus
          throw err
        } else {
          logEvent('Error in readFromPort: '+ error)
          logEvent('Message status: ' + msgStatus)
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

  const dialogWithPort = async (sendMsg, timeout) => {

    console.log('opened port')

    //send message
    await writeToPort(sendMsg)
    console.log('wrote command')
    let res
    
    //listen for response until timeout
    try {
      res = await readFromPortWithTimeout(timeout)
    } catch (err) {
      console.log('Listen for response Error: ', err)
    }
    //return response or undefined
    return res
  }

    const utfEncoder = new TextEncoder();
    // const utfDecoder = new TextDecoder();

    const writeToPort = async (msg, callback = () => {}) => {
      let writer
      try {
        writer = activePort.value.writable.getWriter()
        const fixType = (typeof(msg) === 'string') ? utfEncoder.encode(msg) : msg
        const utfMsg = new Uint8Array(fixType);
        console.log('msg type: ', typeof(msg))
        await writer.write(utfMsg);
        callback(msg)            
      } catch (err) {
        console.log('Error writing to device: ', err)
      } finally {
        logEvent(`Wrote to COM Port: ${msg}`)
        writer.releaseLock()
      }
    }

      /**Initialize the Pinia 
   * Make sure the activePort state is correct
   **/
  const initPinia = async () => {
    activePort.value = [...await navigator.serial.getPorts()][0]  
  }
  console.log('init pinia')
  initPinia()

  return { 
    activePort,
    activeListen, 
    closeActivePort,
    receivedMsgs,
    readFromPortWithTimeout,
    dialogWithPort,
    changeActivePort, 
    initializePort, 
    portStatus,
    activePortSignals,
    disconnectPort,
    writeToPort,
    browserCapable,
    portAuthorized,
    addReceivedMessage,
    receivedMessages
  }
})
