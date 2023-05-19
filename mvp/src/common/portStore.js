import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useLogStore } from './logStore'
import config from '@/data/mvpConfig.json'

export const  usePortStore = defineStore('port', () => {
  
  const { logEvent } = useLogStore()

  // logEvent('Started portStore')
  console.log('starting portStore')

  //state
  const activePort = ref(undefined)
  const listening = ref(false)

  //getters
  const browserCapable = computed(() => { return "serial" in navigator})
  const portAuthorized = computed(() => !!activePort.value)

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

  /**
   * We allow only one port to be authorized.  We also force
   * the user to authorize a port if one isn't already authorized
   * since we cannot do it programatically.
   */
  async function initializePort() {
    console.log('starting initializePort')
    await trimPorts()
    if (!activePort.value) {
      alert('You must authorize a COM port for this browser.')
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

  async function getReaderWithTimeout(timeout) {
    listening.value = true
    const reader = await getReader()
    const timer = setTimeout(()=> {
      listening.value = false
      reader.releaseLock()
    }, timeout)
    return { timer, reader }   
  }

  const getReader = async () => await activePort.value.readable.getReader();
  
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

  const activePortSignals = async () => {
    return await activePort.value.getSignals()
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

      /**Initialize the Pinia 
   * Make sure the activePort state is correct
   **/
  const initPortPinia = async () => {
    activePort.value = [...await navigator.serial.getPorts()][0]  
  }
  initPortPinia()

  return { 
    activePort,
    closeActivePort,
    changeActivePort, 
    initializePort, 
    activePortSignals,
    disconnectPort,
    browserCapable,
    portAuthorized,
    portStatus,
    getReaderWithTimeout,
    listening
  }
})
