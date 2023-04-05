import { ref } from 'vue'
import { defineStore } from 'pinia'
import { EventLogger } from '../composables/eventLogger'

const { log } = EventLogger()

export const  useLogStore = defineStore('log', () => {

  //state
  const entries = ref([])

  //getters

  //actions
  function logEvent(event, result='none'){
    console.log('logging event: ', event)
    addLogEntry(log(event, result))
  }

  //utilities
  function addLogEntry (entry) {
    entries.value.unshift(entry)
  }

  return { 
    entries,
    logEvent
  }
})
