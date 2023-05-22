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

  //returns a deadman object with reset timer function for long conversations
  async function getReaderWithTimeout(timeout) {
    const reader = await activePort.value.readable.getReader();
    const deadman = (() => {
      let timer = undefined
      const resetTimer = timeout => {
        console.log('resetting timer')
          return setTimeout(()=> {
          console.log('firing timeout')
          listening.value = false
          reader.releaseLock()
        }, timeout)}
      return { timer, resetTimer }
    })()
    deadman.timer = deadman.resetTimer(timeout)
    return { deadman, reader }   
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
    if (!activePort.value.readable) {
      try {
        await activePort.value.open(config.comProtocol)
      }catch (err) {
        console.log('Error in portStore opening active port: ', err)
      }      
    } else {
      console.log('Active port is already open')
    } 
  }

  const closeActivePort = async () => {
    console.log('Closing active Port.')
    try {
      await activePort.value.close()
      console.log('Serial port closed promise resolved')
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
    browserCapable,
    portAuthorized,
    portStatus,
    getReaderWithTimeout,
    listening
  }
})
