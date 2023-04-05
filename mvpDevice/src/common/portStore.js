import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import config from '@/data/mvpConfig.json'

export const  usePortStore = defineStore('port', () => {

  //state
  const activePort = ref()
  const activeReader = ref()
  const activeWriter = ref()

  //getters
  const browserCapable = computed(() => { return "serial" in navigator})
  const portOpenStatus = computed(() => {
    console.log('Checking Readable status: ', activePort.value.readable)
    return activePort.value.readable ? 'Port is open' : 'Port is closed or not selected'
  })

  //actions
  async function changeActivePort() {
    const newPort = await authorizePort()
    if (newPort) {
        console.log('forgetting active port...')
        await forgetPort(activePort.value)
        await initializePort()
    }
  }

  async function initializePort() {
    await trimPorts()
    activePort.value = [...await navigator.serial.getPorts()][0]
    if (!activePort.value) {
      alert('No COM port connected.  \nClick "Connect Port" to connect a COM Port.')
    } else {
      await openActivePort()
    }
  }


  /**Port authorization management
   * 
   * Used to ensure ports are properly opened and closed.  Limit
   * app to a single authorized port.
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
        await closeReader();
        await closeWriter();
        if (await port.readable) (await port.close());
        await port.forget();
        port = null
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

  //Utilities
  const isReaderLocked = async () => { 
    if (activePort.value) {
      if (await activePort.value.readable) {
        const status = await activePort.value.readable.locked
        console.log('returning reader status: ', status)
        return status
      } 
    } 
    return false
  }
  
  const isWriterLocked = async () => { 
    if (activePort.value) {
      if (await activePort.value.writable) {
        const status = await activePort.value.writable.locked
        return status
      } 
    } 
    return false
  }

  const openActivePort = async () => {
    if (activePort.value) {
      try {
        await activePort.value.open(config.comProtocol)
        console.log('just opened port: ', activePort.value)
      }catch (err) {
        console.log('Error in portStore opening active port: ', err)
      }
    }
  }

  async function openReader () {
    if (! await isReaderLocked()) {
      const reader = await activePort.value.readable.getReader()
      return reader
    }
  }

  async function closeReader() {
    if (await isReaderLocked()) {
      await activeReader.value.releaseLock();
      activeReader.value = null
    }
  }

  async function openWriter() {
    if (! await isWriterLocked()) {
      const writer = await activePort.value.writable.getWriter()
      console.log('got writer: ', writer)
      return writer
    }
  }

  async function closeWriter() {
    if (await isWriterLocked()) {
      await activeWriter.value.releaseLock();
      activeWriter.value = null
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

  return { 
    activePort, 
    activeReader,
    activeWriter,
    openReader, closeReader,
    openWriter, closeWriter,
    changeActivePort, 
    initializePort, 
    portStatus,
    activePortSignals,
    browserCapable,
    portOpenStatus
  }
})
