import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useLogStore } from './logStore'
import config from '@/data/mvpConfig.json'

export const  usePortStore = defineStore('port', () => {
  
  const { logEvent } = useLogStore()

  logEvent('Started portStore')

  //state
  const activePort = ref(undefined)
  const receivedMsgs = ref(Array(0))
  let quitListen = false

  //getters
  const browserCapable = computed(() => { return "serial" in navigator})
  const portAuthorized = computed(() => activePort.value)
  const portOpen = computed(() => activePort.value ? activePort.value.readable : false)
  const receivedMessages = computed(() => receivedMsgs.value)

  //actions
  async function changeActivePort() {
    const newPort = await authorizePort()
    if (newPort) {
        console.log('forgetting active port...')
        // await forgetActivePort()
        await forgetPort(activePort.value)
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
    await trimPorts()
    activePort.value = [...await navigator.serial.getPorts()][0]
    if (!activePort.value) {
      alert('No COM port connected.  \nClick "Connect Port" to connect a COM Port.')
    } else {
      logEvent('Opening Port')
      await openActivePort();
      listenToActivePort();
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
      console.log('just opened port: ', activePort.value)
      console.log('readable property is: ', activePort.value.readable)
    }catch (err) {
      console.log('Error in portStore opening active port: ', err)
    }
  }

  const disconnectPort = async () => {
    quitListen = true
    await forgetPort(activePort.value)
    quitListen = false
    await initializePort()
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

    // from: https://developer.chrome.com/en/articles/serial/
    const listenToActivePort = async (callback = () => {}) => {
      logEvent('Started Listening to port...')
      while (activePort.value.readable && !quitListen) {
        const reader = activePort.value.readable.getReader()
        try {
          while (true) {
            const { value, done } = await reader.read()
            if (done) {
              // Allow the serial port to be closed later.
              reader.releaseLock()
              break;
            }
            if (value) {
              receivedMsgs.value.push(value[0])
              callback(value)
            }
          }
        } catch (error) {
          console.log('Non-fatal error in listen to port: ', error)
          quitListen = true
        }
        logEvent('Stopped listening to port...')  
        quitListen = false
      }
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

  return { 
    activePort, 
    receivedMsgs,
    changeActivePort, 
    initializePort, 
    portStatus,
    activePortSignals,
    disconnectPort,
    writeToPort,
    browserCapable,
    portAuthorized,
    portOpen,
    addReceivedMessage,
    receivedMessages
  }
})
